package com.dmarchesseault.sudoku;

import com.dmarchesseault.sudoku.Board;

/**
 * Abstract strategy the attempts to narrow the set of candidates values on a board.
 */
abstract class SolverStrategy
{

    abstract int apply(final Board board) throws BoardSanityException;

    abstract int applyOnce(final Board board) throws BoardSanityException;

}
