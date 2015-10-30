package com.dmarchesseault.sudoku;

/**
 * This exception indicate we encountered an integrity problem on the board.
 * It should happen only as the consequence of having made an erroneous guess in the past.
 * A search solver should handle the exception by backtracking in the change history to undo the erroneous guess.
 */
class BoardSanityException extends Exception
{
    BoardSanityException(String message)
    {
        super(message);
    }

    BoardSanityException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
