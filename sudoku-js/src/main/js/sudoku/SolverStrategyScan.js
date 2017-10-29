console && console.log("### SolverStrategyScan.js begin");

(function(ns)
{
    /**
     * Solver strategy that simply scans the rows, columns and 3x3 group to narrow the set of candidates of each cell.
     */
    //class SolverStrategyScan extends SolverStrategy
    ns.SolverStrategyScan = function() {

        //private Board _board;


        // Scan the full board once and collect the flags for already solved cells.
        // That gives us 27 masks: 9 rows, 9 columns, 9 groups.
    //    private final int[] _rowMasks = new int[9];
    //    private final int[] _colMasks = new int[9];
    //    private final int[] _blockMasks = new int[9];

        //private final int[] _groupKnownDigitsFlags = new int[3*9];
        this._groupKnownDigitsFlags = new Array(3*9);

    };


    //@Override
    //int apply(Board board) throws BoardSanityException
    ns.SolverStrategyScan.prototype.apply = function(board)
    {
        let ret = 0;
        let hits = 1; //temp value to enter loop
        while(hits > 0 && board.notSolved())
        {
            hits = this.applyOnce(board);
            ret += hits;
        }
        return ret;
    };

    //int applyOnce(Board board) throws BoardSanityException
    ns.SolverStrategyScan.prototype.applyOnce = function(board)
    {
        let ret = 0;

        this._board = board;

        if (board.notSolved())
        {
            this.initKnownDigitsFlags();
            ret += this.scanCollisionsInGroups();
        }
        if (board.notSolved())
        {
            ret += this.scanUniqueInGroups();
        }
        if (board.notSolved())
        {
            ret += this.scanIdenticalFlagsInGroups();
        }

        return ret;
    };


    /**
     * For each cell group (row, column or block), collect flags for the digits that are already known.
     * E.g. if a cell is solved with value 5, we set the flag for 5 in the group.
     */
    //void initKnownDigitsFlags()
    ns.SolverStrategyScan.prototype.initKnownDigitsFlags = function()
    {
        this._groupKnownDigitsFlags.fill(0);

        // In effect we scan each cell 3 times.
        // We could do a single scan and set the flag in 3 group for each hit.

        const cellGroups = this._board.getCellGroups();
        for (let groupIndex = 0; groupIndex < this._groupKnownDigitsFlags.length; groupIndex++)
        {
            const cellGroup = cellGroups[groupIndex];
            for (let key in cellGroup)
            {
                const  cell = cellGroup[key];
                const cellState = cell.getCellState();
                if (cellState.isSingleDigit())
                {
                    digitFlag = cellState.getDigitFlags();
                    this._groupKnownDigitsFlags[groupIndex] |= digitFlag;
                }
            }
        }
    };

    /**
     * For each cell in the group, we use a group-wise mask to narrow the set of candidates.
     * Each flag set in the mask would be a collision with a known digit so we reset that flag in the cell.
     *
     * @return number of hits
     */
    //int scanCollisionsInGroups() throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanCollisionsInGroups = function()
    {
        let ret = 0;

        const cellGroups = this._board.getCellGroups();
        for (groupIndex = 0; groupIndex < cellGroups.length; groupIndex++)
        {
            const cellGroup = cellGroups[groupIndex];
            const knownDigitsFlags = this._groupKnownDigitsFlags[groupIndex];
            ret += this.scanCollisionsInGroup(cellGroup,knownDigitsFlags);
        }
        return ret;
    };

    /**
     * For each cell in the group, we use a group-wise mask to narrow the set of candidates.
     * Each flag set in the mask would be a collision with a known digit so we reset that flag in the cell.
     *
     * @return number of hits
     */
    //int scanCollisionsInGroup(final Cell[] cellGroup, final int knownDigitsFlags) throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanCollisionsInGroup = function(cellGroup, knownDigitsFlags)
    {
        let ret = 0;

        // Do only if there is at least one solved cell in the group
        if (knownDigitsFlags !== 0)
        {
            for (let key in cellGroup)
            {
                const cell = cellGroup[key];
                // Skip solved cells, otherwise it would zap their flags
                if (!cell.isSingleDigit())
                {
                    const resetFlags = cell.changeResetDigitFlags(knownDigitsFlags, ns.CellChange.Reason.SOLVER);

                    // Count a hit if any flag was changed in that cell
                    if (resetFlags !== 0)
                    {
                        ret++;
                    }

                    if (cell.isSingleDigit())
                    {
                        //todo should check if cell has been solve and add it to a backlog
                        this.LOG.info("scanCollisionsInGroup: hit, cell=" + cell);
                    }
                }
            }
        }
        return ret;
    };


    /**
     * Scan all groups with {@link #scanUniqueInGroup(Cell[], int)}
     *
     * @return number of hits
     */
    //int scanUniqueInGroups() throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanUniqueInGroups = function()
    {
        let ret = 0;

        const cellGroups = this._board.getCellGroups();
        for (let groupIndex = 0, len = cellGroups.length; groupIndex < len; groupIndex++)
        {
            const knownDigitsFlag = this._groupKnownDigitsFlags[groupIndex];
            ret += this.scanUniqueInGroup(cellGroups[groupIndex], knownDigitsFlag);
        }
        return ret;
    };



    /**
     * Scans a cell group for a candidate that appears only once in the group.
     *
     * @param cellGroup a group of cells, i.e. a row, a column or a block
     * @param knownDigitsFlags bit mask mask with the flags for all the digits already solved in the group.
     * @return number of hits
     */
    //todo Should be generalized to N > 1. If a pair of flags exists only in two cells, we can reset the other flags of those cells.
    //int scanUniqueInGroup(final Cell[] cellGroup, final int knownDigitsFlags) throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanUniqueInGroup = function(cellGroup, knownDigitsFlags)
    {
        let ret = 0;

        // Iterate on candidate digit
        for (let candidateDigit = 0, candidateFlag = 0x1; candidateDigit < 9; candidateDigit++, candidateFlag <<= 1)
        {
            // Is the candidate among the known digits?
            if ((knownDigitsFlags & candidateFlag) === 0)
            {
                // Candidate not yet among the known digits

                // Scan cells in group and count how many cells have that candidate.
                let hitCount = 0;
                let hitIndex = -1;
                for (let indexInGroup = 0; indexInGroup < 9; indexInGroup++)
                {
                    const cell = cellGroup[indexInGroup];
                    const cellDigitFlags = cell.getDigitFlags();

                    if ((cellDigitFlags & candidateFlag) !== 0)
                    {
                        // This cell includes the candidate. Remember the cell in case it is the only one.
                        hitCount++;
                        hitIndex = indexInGroup;
                    }
                }

                if (hitCount === 1)
                {
                    // Only one cell has the candidate digit. Solved!
                    const cell = cellGroup[hitIndex];
                    this.LOG.info("scanUniqueInGroup: Hit, only one cell has candidate " + candidateDigit + ", cell=" + cell);
                    cell.changeToDigit(candidateDigit, ns.CellChange.Reason.SOLVER);
                    ret++;
                }
            }
        }
        return ret;
    };


    /**
     * Scan all groups with {@link #scanIdenticalFlagsInGroup(Cell[])}
     *
     * @return number of hits
     */
    //int scanIdenticalFlagsInGroups() throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanIdenticalFlagsInGroups = function()
    {
        let ret = 0;

        const cellGroups = this._board.getCellGroups();
        for (let key in cellGroups)
        {
            const cellGroup = cellGroups[key];
            ret += this.scanIdenticalFlagsInGroup(cellGroup);
        }
        return ret;
    };



    /**
     * Scan a group for cells with identical flags.
     * If two cells have exactly the same two candidates, the corresponding digits will necessarily be in those
     * two cells, so those candidates can be eliminated in the other cells of the group.
     * It is generalized to sets of N cells having exactly the same N candidates, those candidates can be
     * eliminated in the other cells of the group.
     *
     * @return number of hits
     */
    //int scanIdenticalFlagsInGroup(final Cell[] cellGroup) throws BoardSanityException
    ns.SolverStrategyScan.prototype.scanIdenticalFlagsInGroup = function(cellGroup)
    {
        let ret = 0;

        // Collect unsolved cells into a map where the key is the flags and value is the list of cells with those flags.
        // The map is sorted in ascending order of how many flags the key has.

        /**
         * We compare first on the count of flags, A smaller comes before a large count.
         * If counts are equal, we sort on the flags.
         */
        let digitFlagsComparator = function(flags1, flags2)
        {
            const count1 = CellState.countDigitFlags(flags1);
            const count2 = CellState.countDigitFlags(flags2);
            return (count1 !== count2) ? count1 - count2 : flags1 - flags2;
        };

        //SortedMap<Integer, List<Cell>> fromDigitFlagsToCellSets = new TreeMap<Integer, List<Cell>>(digitFlagsComparator);
        const fromDigitFlagsToCellSets = {};
        for (let key in cellGroup)
        {
            const cell = cellGroup[key];
            const digitFlags = cell.getDigitFlags();
            let cellList = fromDigitFlagsToCellSets[digitFlags];
            if (!cellList)
            {
                //cellList = new LinkedList<Cell>();
                cellList = [];
                fromDigitFlagsToCellSets[digitFlags] = cellList;
            }
            cellList.push(cell);
        }

        //todo sort using digitFlagsComparator

        // Go through map to find a flags value with a cell list of the same size.
        // Little optimization: skip it if only lists of one element.
        if (fromDigitFlagsToCellSets.length < 9)
        {
            //for (Map.Entry<Integer,List<Cell>> entry : fromDigitFlagsToCellSets.entrySet())
            for (let digitFlags in fromDigitFlagsToCellSets)
            {
                const cellList = fromDigitFlagsToCellSets[digitFlags];
                const cellCount = cellList.size();

                // Little optimization: skip meaningless lists.
                if (cellCount > 1)
                {
                    const digitFlagsCount = CellState.countDigitFlags(digitFlags);
                    if (cellCount === digitFlagsCount)
                    {
                        // Scan other cells in group for the flags
                        for (let key in cellGroup)
                        {
                            const otherCell = cellGroup[key];
                            // Make sure sure it is "other"
                            if (!cellList.contains(otherCell))
                            {
                                // See if there a change
                                const changedFlags = otherCell.changeResetDigitFlags(digitFlags, ns.CellChange.Reason.SOLVER);
                                if (changedFlags !== 0)
                                {
                                    // That count as a hit!
                                    ret++;
                                    this.LOG.info("scanIdenticalFlagsInGroup: hit, cell=" + otherCell);
                                }
                            }
                        }
                    }
                    else if (cellCount > digitFlagsCount)
                    {
                        // Integrity error
    //                        final; StringBuilder sb = new StringBuilder();
    //                        sb += (String.format("scanIdenticalFlagsInGroup: Integrity problem; %s flags in %d cells:", CellState.digitFlagsToString(digitFlags), cellCount));
    //                        for (final Cell cell : cellList)
    //                    this.LOG.warn(String.format("scanIdenticalFlagsInGroup: Integrity problem; %s flags in %d cells: %s", CellState.digitFlagsToString(digitFlags), cellCount, cellList));
                        this.LOG.warn("scanIdenticalFlagsInGroup: Integrity problem; "+CellState.digitFlagsToString(digitFlags)+" flags in "+cellCount+" cells:"+cellList);
                    }
                }
            }
        }

        return ret;
    };

    ns.SolverStrategyScan.prototype.LOG = ns.SolverStrategyScan.LOG = Logger.getLogger("SolverStrategyScan");

}(Module("sudoku")));

console && console.log("### SolverStrategyScan.js end");

