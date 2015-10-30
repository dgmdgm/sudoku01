package com.dmarchesseault.sudoku;

/**
 * Represents any change to a board cell.
 * A game can be represented by a sequence of cell changes.
 *
 * @see Game
 */
//todo immutable
class CellChange
{

    enum Reason
    {
        INIT,               // Initialization of the board
        PLAYER,             // The player set the digit
        SOLVER_GUESS,       // A solver set a digit but it is a reversible
        SOLVER              // A solver changed flags only without setting the digit
    }


    private final Cell _cell;
    private final CellState _cellStateBefore;
    private final CellState _cellStateAfter;
    private final Reason _reason;

    CellChange(final Cell cell, final CellState cellStateBefore, final CellState cellStateAfter, final Reason reason)
    {
        _cell = cell;
        _cellStateBefore = cellStateBefore;
        _cellStateAfter = cellStateAfter;
        _reason = reason;
    }

    public Cell getCell()
    {
        return _cell;
    }

    public CellState getCellStateBefore()
    {
        return _cellStateBefore;
    }

    public CellState getCellStateAfter()
    {
        return _cellStateAfter;
    }

    public Reason getReason()
    {
        return _reason;
    }

    @Override
    public String toString()
    {
        return "CellChange{" +
                "_cell=(" + _cell.getRow() + "," + _cell.getCol()+
                "), _cellStateBefore=" + _cellStateBefore +
                ", _cellStateAfter=" + _cellStateAfter +
                ", _reason=" + _reason +
                '}';
    }
}
