package com.dmarchesseault.sudoku;

/**
 * Abstract strategy the attempts to narrow the set of candidates values on a board.
 */
abstract class SolverStrategy
{

    abstract int apply(final Board board) throws BoardSanityException;

}
