package com.dmarchesseault.sudoku;

import org.apache.log4j.Logger;

import java.util.*;

/**
 * Solver strategy that simply scans the rows, columns and 3x3 group to narrow the set of candidates of each cell.
 */
class SolverStrategyScan extends SolverStrategy
{
    private static final Logger LOG = Logger.getLogger(SolverStrategyScan.class);

    private Board _board;

    // Scan the full board once and collect the flags for already solved cells.
    // That gives us 27 masks: 9 rows, 9 columns, 9 groups.
//    private final int[] _rowMasks = new int[9];
//    private final int[] _colMasks = new int[9];
//    private final int[] _blockMasks = new int[9];

    private final int[] _groupKnownDigitsFlags = new int[3*9];

    @Override
    int apply(Board board) throws BoardSanityException
    {
        int ret = 1; //temp value to enter loop
        while(! board.isSolved() && ret > 0)
        {
            ret = applyOnce(board);
        }
        return ret;
    }

    int applyOnce(Board board) throws BoardSanityException
    {
        int ret = 0;

        _board = board;

        if (! board.isSolved())
        {
            initKnownDigitsFlags();
            ret += scanCollisionsInGroups();
        }
        if (! board.isSolved())
        {
            ret += scanUniqueInGroups();
        }
        if (! board.isSolved())
        {
            ret += scanIdenticalFlagsInGroups();
        }

        return ret;
    }


    /**
     * For each cell group (row, column or block), collect flags for the digits that are already known.
     * E.g. if a cell is solved with value 5, we set the flag for 5 in the group.
     */
    void initKnownDigitsFlags()
    {
        Arrays.fill(_groupKnownDigitsFlags,0);

        // In effect we scan each cell 3 times.
        // We could do a single scan and set the flag in 3 group for each hit.

        final Cell[][] cellGroups = _board.getCellGroups();
        for (int groupIndex = 0; groupIndex < _groupKnownDigitsFlags.length; groupIndex++)
        {
            final Cell[] cellGroup = cellGroups[groupIndex];
            for (final Cell cell : cellGroup)
            {
                final CellState cellState = cell.getCellState();
                if (cellState.isSingleDigit())
                {
                    final int digitFlag = cellState.getDigitFlags();
                    _groupKnownDigitsFlags[groupIndex] |= digitFlag;
                }
            }
        }
    }

    /**
     * For each cell in the group, we use a group-wise mask to narrow the set of candidates.
     * Each flag set in the mask would be a collision with a known digit so we reset that flag in the cell.
     *
     * @return number of hits
     */
    int scanCollisionsInGroups() throws BoardSanityException
    {
        int ret = 0;

        final Cell[][] cellGroups = _board.getCellGroups();
        for (int groupIndex = 0; groupIndex < cellGroups.length; groupIndex++)
        {
            final Cell[] cellGroup = cellGroups[groupIndex];
            final int knownDigitsFlags = _groupKnownDigitsFlags[groupIndex];
            scanCollisionsInGroup(cellGroup,knownDigitsFlags);
        }
        return ret;
    }

    /**
     * For each cell in the group, we use a group-wise mask to narrow the set of candidates.
     * Each flag set in the mask would be a collision with a known digit so we reset that flag in the cell.
     *
     * @return number of hits
     */
    int scanCollisionsInGroup(final Cell[] cellGroup, final int knownDigitsFlags) throws BoardSanityException
    {
        int ret = 0;

        // Do only if there is at least one solved cell in the group
        if (knownDigitsFlags != 0)
        {
            for (final Cell cell : cellGroup)
            {
                // Skip solved cells, otherwise it would zap their flags
                if (!cell.isSingleDigit())
                {
                    final int resetFlags = cell.changeResetDigitFlags(knownDigitsFlags, CellChange.Reason.SOLVER);

                    // Count a hit if any flag was changed in that cell
                    if (resetFlags != 0)
                    {
                        ret++;
                    }

                    if (cell.isSingleDigit())
                    {
                        //todo should check if cell has been solve and add it to a backlog
                        LOG.info("scanCollisionsInGroup: hit, cell=" + cell);
                    }
                }
            }
        }
        return ret;
    }


    /**
     * Scan all groups with {@link #scanUniqueInGroup(Cell[], int)}
     *
     * @return number of hits
     */
    int scanUniqueInGroups() throws BoardSanityException
    {
        int ret = 0;

        final Cell[][] cellGroups = _board.getCellGroups();
        for (int groupIndex = 0; groupIndex < cellGroups.length; groupIndex++)
        {
            final int knownDigitsFlag = _groupKnownDigitsFlags[groupIndex];
            ret += scanUniqueInGroup(cellGroups[groupIndex], knownDigitsFlag);
        }
        return ret;
    }



    /**
     * Scans a cell group for a candidate that appears only once in the group.
     *
     * @param cellGroup a group of cells, i.e. a row, a column or a block
     * @param knownDigitsFlags bit mask mask with the flags for all the digits already solved in the group.
     * @return number of hits
     */
    //todo Should be generalized to N > 1. If a pair of flags exists only in two cells, we can reset the other flags of those cells.
    int scanUniqueInGroup(final Cell[] cellGroup, final int knownDigitsFlags) throws BoardSanityException
    {
        int ret = 0;

        // Iterate on candidate digit
        for (int candidateDigit = 0, candidateFlag = 0x1; candidateDigit < 9; candidateDigit++, candidateFlag <<= 1)
        {
            // Is the candidate among the known digits?
            if ((knownDigitsFlags & candidateFlag) == 0)
            {
                // Candidate not yet among the known digits

                // Scan cells in group and count how many cells have that candidate.
                int hitCount = 0;
                int hitIndex = -1;
                for (int indexInGroup = 0; indexInGroup < 9; indexInGroup++)
                {
                    final Cell cell = cellGroup[indexInGroup];
                    final int cellDigitFlags = cell.getDigitFlags();

                    if ((cellDigitFlags & candidateFlag) != 0)
                    {
                        // This cell includes the candidate. Remember the cell in case it is the only one.
                        hitCount++;
                        hitIndex = indexInGroup;
                    }
                }

                if (hitCount == 1)
                {
                    // Only one cell has the candidate digit. Solved!
                    final Cell cell = cellGroup[hitIndex];
                    LOG.info("scanUniqueInGroup: Hit, only one cell has candidate " + candidateDigit + ", cell=" + cell);
                    cell.changeToDigit(candidateDigit, CellChange.Reason.SOLVER);
                    ret++;
                }
            }
        }
        return ret;
    }



    /**
     * Scan all groups with {@link #scanIdenticalFlagsInGroup(Cell[])}
     *
     * @return number of hits
     */
    int scanIdenticalFlagsInGroups() throws BoardSanityException
    {
        int ret = 0;

        final Cell[][] cellGroups = _board.getCellGroups();
        for (Cell[] cellGroup : cellGroups)
        {
            ret += scanIdenticalFlagsInGroup(cellGroup);
        }
        return ret;
    }



    /**
     * Scan a group for cells with identical flags.
     * If two cells have exactly the same two candidates, the corresponding digits will necessarily be in those
     * two cells, so those candidates can be eliminated in the other cells of the group.
     * It is generalized to sets of N cells having exactly the same N candidates, those candidates can be
     * eliminated in the other cells of the group.
     *
     * @return number of hits
     */
    int scanIdenticalFlagsInGroup(final Cell[] cellGroup) throws BoardSanityException
    {
        int ret = 0;

        // Collect unsolved cells into a map where the key is the flags and value is the list of cells with those flags.
        // The map is sorted in ascending order of how many flags the key has.

        //todo move to static
        Comparator<Integer> digitFlagsComparator = new Comparator<Integer>()
        {
            /**
             * We compare first on the count of flags, A smaller comes before a large count.
             * If counts are equal, we sort on the flags.
             */
            public int compare(Integer flags1, Integer flags2)
            {
                final int count1 = CellState.countDigitFlags(flags1);
                final int count2 = CellState.countDigitFlags(flags2);
                return (count1 != count2) ? count1 - count2 : flags1 - flags2;
            }
        };

        SortedMap<Integer, List<Cell>> fromDigitFlagsToCellSets = new TreeMap<Integer, List<Cell>>(digitFlagsComparator);
        for (final Cell cell : cellGroup)
        {
            final Integer digitFlags = cell.getDigitFlags();
            List<Cell> cellList = fromDigitFlagsToCellSets.get(digitFlags);
            if (cellList == null)
            {
                cellList = new LinkedList<Cell>();
                fromDigitFlagsToCellSets.put(digitFlags,cellList);
            }
            cellList.add(cell);
        }

        // Go through map to find a flags value with a cell list of the same size.
        // Little optimization: skip it if only lists of one element.
        if (fromDigitFlagsToCellSets.size() < 9)
        {
            for (Map.Entry<Integer,List<Cell>> entry : fromDigitFlagsToCellSets.entrySet())
            {
                final int digitFlags = entry.getKey();
                final List<Cell> cellList = entry.getValue();
                final int cellCount = cellList.size();

                // Little optimization: skip meaningless lists.
                if (cellCount > 1)
                {
                    final int digitFlagsCount = CellState.countDigitFlags(digitFlags);
                    if (cellCount == digitFlagsCount)
                    {
                        // Scan other cells in group for the flags
                        for (final Cell otherCell : cellGroup)
                        {
                            // Make sure sure it is "other"
                            if (!cellList.contains(otherCell))
                            {
                                // See if there a change
                                final int changedFlags = otherCell.changeResetDigitFlags(digitFlags, CellChange.Reason.SOLVER);
                                if (changedFlags != 0)
                                {
                                    // That count as a hit!
                                    ret++;
                                    LOG.info("scanIdenticalFlagsInGroup: hit, cell=" + otherCell);
                                }
                            }
                        }
                    }
                    else if (cellCount > digitFlagsCount)
                    {
                        // Integrity error
//                        final; StringBuilder sb = new StringBuilder();
//                        sb.append(String.format("scanIdenticalFlagsInGroup: Integrity problem; %s flags in %d cells:", CellState.digitFlagsToString(digitFlags), cellCount));
//                        for (final Cell cell : cellList)
                        LOG.warn(String.format("scanIdenticalFlagsInGroup: Integrity problem; %s flags in %d cells: %s", CellState.digitFlagsToString(digitFlags), cellCount, cellList));
                    }
                }
            }
        }

        return ret;
    }
}
