package com.dmarchesseault.sudoku;

import org.apache.log4j.Logger;

import java.util.List;

/**
 * @see Game
 */
class Cell implements SudokuConstants
{
    private static final Logger LOG = Logger.getLogger(Cell.class);

    // A cell has a immutable pointer to its board and immutable position on the board.
    private final Board _board;
    private final int _row;
    private final int _col;

    // The cell state is the only mutable part.
    private CellState _cellState;


    /**
     * Constructor
     *
     * @param board
     * @param row
     * @param col
     */
    Cell(Board board, final int row, final int col)
    {
        if (!(0 <= row && row < 9 && 0 <= col && col < 9))
        {
            throw new IllegalArgumentException();
        }

        _board = board;
        _row = row;
        _col = col;
        _cellState = CellState.INIT_STATE;
    }

    public int getRow()
    {
        return _row;
    }

    public int getCol()
    {
        return _col;
    }

    public int getBlockIndex()
    {
        return _row / 3 * 3 + _col / 3;
    }

    public int getIndexInBlock()
    {
        return _row % 3 * 3 + _col % 3;
    }

    CellState getCellState()
    {
        return _cellState;
    }

    //change state to digit
    //todo return change instance including changed flags
    CellChange changeToDigit(final int digit, CellChange.Reason reason) throws BoardSanityException
    {
        final CellChange ret;
        if (_cellState.isDigit(digit))
        {
            // no change
            //todo log
            ret = null;
        }
        else
        {
            // For consistency with other sanity checks, we throw the exception after the change is added to the board history.
            // This way, exception handlers know how to reverse the change.
            //todo fix ugly; might use exception to indicate if a change was made.
            BoardSanityException bse = null;
            if (SudokuConstants.CHECK_SANITY)
            {
                if (_cellState.isDigit(digit))
                {
                    bse = new BoardSanityException("Attempting to change to same digit ("+digit+") in cell " + this);
                    LOG.error("changeCellDigit: throwing " + bse);
                }
                else if (!_cellState.includesDigit(digit))
                {
                    bse = new BoardSanityException("Attempting to change to unavailable digit ("+digit+") in cell " + this);
                    LOG.error("changeCellDigit: throwing " + bse);
                }
            }

            ret = changeState(CellState.KNOWN_DIGIT_STATE[digit], reason);

            if (bse != null) throw bse;
        }

        return ret;
    }

    /**
     * Centralizes state changes to record and publish the change.
     * The change is sent to the board for it to record history.
     * Events mey be published to observers.
     *
     * @param newState new state
     * @param reason reason for change
     */
    CellChange changeState(final CellState newState, final CellChange.Reason reason) throws BoardSanityException
    {
//        // Here is a good checkpoint for sanity checks
//        if (CHECK_SANITY && _board != null)
//        {
//            final List<String> diagnostics = _board.checkSanity();
//            if (diagnostics != null)
//            {
//                LOG.warn("changeState: Sanity problem before change, "+diagnostics.size()+" diagnostics.");
//                for (int i=0; i<diagnostics.size(); i++) LOG.debug("changeState: diagnostic("+i+")=" + diagnostics.get(i));
//            }
//        }


        final CellState oldState = _cellState;
        _cellState = newState;
        final CellChange ret = new CellChange(this, oldState, _cellState, reason);

        // Notify board of the change
        if (_board != null) _board.changedCell(ret, true);

        return ret;
    }

    /**
     * Reverses the given change. Used to backtrack in history.
     *
     * @param cellChange change to reverse
     */
    void unchange(CellChange cellChange) throws BoardSanityException
    {
        // Make sure not to record this change in history.
        _cellState = cellChange.getCellStateBefore();


        // Notify board of the change reversal.
        if (_board != null) _board.changedCell(cellChange, false);

        //todo Publish reversal effect for observers
    }


    /**
     * Applies the given mask to reset value flags.
     *
     * @param digitsMask bit mask
     * @param reason reason for change
     * @return the mask representing the values flags that were reset
     */
    public int changeResetDigitFlags(final int digitsMask, final CellChange.Reason reason) throws BoardSanityException
    {
        final int digitFlagsBefore = _cellState.getDigitFlags();
        final int digitFlagsAfter = digitFlagsBefore & ~digitsMask;

        if (digitFlagsBefore != digitFlagsAfter)
        {
            changeState(new CellState(digitFlagsAfter), reason);
        }

        return digitFlagsBefore & digitsMask;
    }


    int getDigit()
    {
        return _cellState.getDigit();
    }

    int getUiDigit()
    {
        return _cellState.getDigit() + 1;
    }

    String getUiDigitFlagsString()
    {
        return _cellState.getUiDigitFlagsString();
    }

    @Override
    public int hashCode()
    {
        //todo
        return super.hashCode();
    }

    @Override
    public String toString()
    {
        return "Cell{" +
                "_row=" + _row +
                ", _col=" + _col +
                ", _cellState=" + _cellState +
                '}';
    }

    boolean isSingleDigit()
    {
        return _cellState.isSingleDigit();
    }

    public int getDigitFlags()
    {
        return _cellState.getDigitFlags();
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Cell cell = (Cell) o;

        if (_col != cell._col) return false;
        if (_row != cell._row) return false;

        return true;
    }
}
