package com.dmarchesseault.sudoku;

import com.dmarchesseault.sudoku.Cell;
import org.apache.log4j.Logger;

import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * @author  Denis Marchesseault
 */
class Board implements SudokuConstants
{
    private static final Logger LOG = Logger.getLogger(Board.class);

    // For convenience, cells can be accessed in multiple ways
    //todo add support for sudoku variants with more constraints, e.g. diagonals, etc

    // Access by linear index in 0..80 range
    private final Cell _cells[] = new Cell[9*9];

    // Access by [row,col] indices. Top left is 0,0; top right is 0,8; bottom right is 8,8.
    private final Cell _cellsByRow[][] = new Cell[9][9];

    // Access by [col,row] indices
    private final Cell _cellsByCol[][] = new Cell[9][9];


    // Access grouped by 3x3 block.
    // Blocks are indexed 0..8 from top left to bottom right. Top right is block 2
    private final Cell _cellsByBlock[][] = new Cell[9][9];

    // All the groups together. Useful for scans.
    private final Cell _cellGroups[][] = new Cell[3*9][9];

    //todo queue or deque?; concurrent needed?
    private final Deque<CellChange> _history = new ConcurrentLinkedDeque<CellChange>();

    // The number of cells with a single digit, i.e. solved cells.
    private int _knownDigitsCount = 0;

    // For testing, we can have a solution to compare with.
    private Board _solutionBoard = null;

    /**
     * Constructor
     */
    Board()
    {
        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                final Cell cell = new Cell(this, row, col);
                _cells[row * 9 + col] = cell;
                _cellsByRow[row][col] = cell;
                _cellsByCol[col][row] = cell;
                _cellsByBlock[cell.getBlockIndex()][cell.getIndexInBlock()] = cell;
            }
        }

        for (int k = 0; k < 9; k++)
        {
            _cellGroups[k] = _cellsByRow[k];
            _cellGroups[9+k] = _cellsByCol[k];
            _cellGroups[18+k] = _cellsByBlock[k];
        }
    }


    Cell[] getCells()
    {
        return _cells;
    }

    /**
     * Returns the cell addressed with a linear index.
     * The ordering is cells in first row, then second row, ...
     *
     * @param index in range [0..80]
     * @return cell
     */
    Cell getCell(final int index)
    {
        return _cellsByRow[index / 9][index % 9];
    }

    Cell[][] getCellsByRow()
    {
        return _cellsByRow;
    }

    Cell[][] getCellsByCol()
    {
        return _cellsByCol;
    }

    Cell[][] getCellsByBlock()
    {
        return _cellsByBlock;
    }

    Cell[][] getCellGroups()
    {
        return _cellGroups;
    }

    /**
     * Returns the cell addressed by row and column.
     *
     * @param row in range 0..8
     * @param col in range 0..8
     * @return cell
     */
    Cell getCell(final int row, final int col)
    {
        return _cellsByRow[row][col];
    }

    /**
     * Returns the cell addressed in a 3x3 block.
     *
     * @param blockRow in range 0..2
     * @param blockCol in range 0..2
     * @param rowInBlock in range 0..2
     * @param colInBlock in range 0..2
     * @return cell
     */
    Cell getCell(final int blockRow, final int blockCol, final int rowInBlock, final int colInBlock)
    {
        if (SudokuConstants.CHECK_SANITY)
        {
            if (!(0 <= blockRow && blockRow < 3))
            {
                throw new IndexOutOfBoundsException("xx ("+blockRow+") not in 0..2 range.");
            }
            if (!(0 <= blockCol && blockCol < 3))
            {
                throw new IndexOutOfBoundsException("yy ("+blockCol+") not in 0..2 range.");
            }
            if (!(0 <= blockRow && blockRow < 3))
            {
                throw new IndexOutOfBoundsException("x ("+rowInBlock+") not in 0..2 range.");
            }
            if (!(0 <= blockCol && blockCol < 3))
            {
                throw new IndexOutOfBoundsException("x ("+colInBlock+") not in 0..2 range.");
            }
        }

        return _cellsByRow[blockRow*3 + rowInBlock][blockCol * 3 + colInBlock];
    }

    Deque<CellChange> getHistory()
    {
        return _history;
    }

    int getUnknownDigitsCount()
    {
        return 81 - getKnownDigitsCount(false);
    }


    int getKnownDigitsCount()
    {
        return getKnownDigitsCount(false);
    }


    int getKnownDigitsCount(final boolean recount)
    {
        if (recount)
        {
            _knownDigitsCount = 0;
            for (final Cell cell : _cells)
            {
                if (cell.isSingleDigit()) _knownDigitsCount++;
            }
        }
        return _knownDigitsCount;
    }


    boolean isSolved()
    {
        return _knownDigitsCount == 81;
    }

    boolean notSolved()
    {
        return _knownDigitsCount != 81;
    }

    Board getSolutionBoard()
    {
        return _solutionBoard;
    }

    void setSolutionBoard(Board solutionBoard)
    {
        _solutionBoard = solutionBoard;
    }

    /**
     * Called to notify the board that a cell has changed.
     * The board is responsible to add/remove the change to the history
     *
     * @param cellChange cell change
     * @param forward true means to add to history; false means to reverse.
     */
    void changedCell(CellChange cellChange, boolean forward) throws BoardSanityException
    {
        if (forward)
        {
            LOG.debug("changedCell: Adding change=" + cellChange + ", history size before is " + _history.size());
            _history.add(cellChange);

            // Detect if the change is solving the cell.
            if (!cellChange.getCellStateBefore().isSingleDigit() && cellChange.getCellStateAfter().isSingleDigit())
            {
                _knownDigitsCount++;
            }
        }
        else
        {
            LOG.debug("changedCell: Removing change=" + cellChange + ", history size before is " + _history.size());
            //todo should check it matches
            final CellChange removedChange = _history.removeLast();
            if (removedChange != cellChange)
            {
                LOG.error("changedCell: Reversal mismatch, change=" + cellChange + ", removedChange=" + removedChange);
            }

            // Detect if the change was solving the cell.
            if (!cellChange.getCellStateBefore().isSingleDigit() && cellChange.getCellStateAfter().isSingleDigit())
            {
                _knownDigitsCount--;
            }
        }

        if (LOG.isDebugEnabled())
        {
            LOG.debug("changedCell:\n" + SudokuHelper.printBoardDigits(this, '.'));
            LOG.debug("changedCell:\n" + SudokuHelper.printBoardDigitFlags(this));
        }

        if (CHECK_SANITY )
        {
            final List<String> diagnostics = checkSanity();
            if (diagnostics != null)
            {
                LOG.warn("changeState: Sanity problem after change, "+diagnostics.size()+" diagnostics.");
                for (int i=0; i<diagnostics.size(); i++) LOG.debug("changeState: diagnostic("+i+")=" + diagnostics.get(i));
            }
        }

    }

    /**
     * Unwinds the last change in the board history.
     *
     * @retu
     */
    CellChange undoLastChange() throws BoardSanityException
    {

        // Undoing changes is tricky
        // We can pop the last change in the history but that does restore the other cells
        // What we need is a history not just of cell change but of full board states

        //todo UNSURE IMPLEMENTATION
        CellChange cellChange = _history.peekLast();
        cellChange.getCell().unchange(cellChange);
        return cellChange;
    }

    /**
     * Performs a sanity check and generates diagnostics.
     *
     * @return null if no problem detected, diagnostics otherwise.
     */
    List<String> checkSanity() throws BoardSanityException
    {
        final List<String> diagnostics = new LinkedList<String>();
        final int MASK_OFF_ALL_FLAGS = ~CellState.ALL_FLAGS;

        for (final Cell cell : _cells)
        {
            final  int flags = cell.getDigitFlags();

            // Check if the cell has invalid flags
            if (flags == 0)
            {
                diagnostics.add("No flags in " + cell + "; ");
                throw new BoardSanityException("No flags in " + cell);
            }
            if ((flags & MASK_OFF_ALL_FLAGS) != 0)
            {
                throw new BoardSanityException("Unexpected flags in " + cell);
//                diagnostics.add("Unexpected flags in " + cell);
            }

            // Check against solution board
            if (CHECK_SANITY_DEEP && _solutionBoard != null)
            {
                final Cell solutionCell = _solutionBoard.getCell(cell.getRow(), cell.getCol());
                final int solutionFlags = solutionCell.getDigitFlags();
                // Flags in the cell of this board must be a superset of the flags in the solution cell.
                if ((flags & solutionFlags) != solutionFlags)
                {
                    diagnostics.add("Divergence from solution. cell=" + cell + ", solutionCell=" + solutionCell);
                }
            }
        }

        for (final Cell[] cellGroup : _cellGroups)
        {
            // No two cells in a group can have the same digit
            for (int iA = 0; iA < 9; iA++)
            {
                final Cell cellA = cellGroup[iA];
                final CellState cellStateA = cellA.getCellState();
                final int digitA = cellStateA.getDigit();
                if (digitA != -1)
                {
                    // Cell A has a solution digit. Check other cells in the group for a colliding solution.

                    final  int flagsA = cellStateA.getDigitFlags();
                    for (int iB = iA+1; iB < 9; iB++)
                    {
                        final Cell cellB = cellGroup[iB];
                        final CellState cellStateB = cellB.getCellState();
                        final  int flagsB = cellStateB.getDigitFlags();
                        if (flagsB == flagsA)
                        {
                            throw new BoardSanityException("Digit " + digitA + " collision between cells " + cellA + cellB);
//                            diagnostics.add("Digit " + digitA + " collision between cells " + cellA + cellB);
                        }
                    }
                }
            }
        }

        return (diagnostics.size() > 0) ? diagnostics : null;
    }
}
