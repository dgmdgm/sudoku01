package com.dmarchesseault.sudoku;

import com.dmarchesseault.sudoku.*;
import org.apache.log4j.Logger;

import java.util.Deque;

/**
 * Solver strategy that does a depth first search to try to assign value to cells.
 */
class SolverStrategySearch extends SolverStrategy
{
    private static final Logger LOG = Logger.getLogger(SolverStrategySearch.class);

    @Override
    int apply(Board board) throws BoardSanityException
    {
        int ret = 0;

        int loopHits = 1; //temp value to enter loop
        while (board.notSolved() && loopHits > 0)
        {
            try
            {
                loopHits = applyOnce(board);
            }
            catch (BoardSanityException e)
            {
                // We have to handle the exceptions the rollback may throw
                BoardSanityException bse = e;
                while (bse != null) {
                    try
                    {
                        LOG.info("Rolling back changes because of sanity issue", bse);

                        // We disallow picking the next digit for pure search, otherwise we risk exception within this catch.
                        final int searchHits = backtrack(board, true);
                        LOG.info("apply: " + searchHits + " search hits after rollback");
                        loopHits = 1;
                        bse = null; // break loop
                    }
                    catch (BoardSanityException e1)
                    {
                        bse = e1;
                    }
                }


            }
            ret += loopHits;
        }
        return ret;
    }

    /**
     *
     * @param board board
     * @return number of hits
     * @throws BoardSanityException
     */
    @Override
    int applyOnce(Board board) throws BoardSanityException
    {
        int ret;

        // Find cell with the least number of candidates
        // Fewer candidates should improve the odds of a good guess and lead to a smaller search tree.

        final Cell[] cells = board.getCells();
        Cell bestCell = null;
        int bestDigitsFlagsCount = 9+1; // temp value such that anything will be better
        int unknownDigitCells = 0;      // How many cell are still unknown
        for (Cell cell : cells)
        {
            final int digitFlagsCount = cell.getCellState().getDigitFlagsCount();
            if (digitFlagsCount > 1)
            {
                unknownDigitCells++;
                if (digitFlagsCount < bestDigitsFlagsCount)
                {
                    bestCell = cell;
                    bestDigitsFlagsCount = digitFlagsCount;
                }
            }
            else if (digitFlagsCount == 1)
            {
                // Solved cell. Just skip it.
            }
            else
            {
                LOG.warn("applyOnce: Integrity problem; no flags in cell " + cell);
            }
        }

        if (unknownDigitCells == 0)
        {
            // This board is solved. Nothing to do
            //todo try to check this earlier
            ret = 0;
        }
        else if (bestCell != null)
        {
            // Found a cell to make a tentative change.

            int digit = bestCell.getCellState().getFirstDigitCandidate();
            LOG.info("apply: Guessing hit, digit="+digit+", cell=" + bestCell);
            bestCell.changeToDigit(digit, CellChange.Reason.SOLVER_GUESS);
            ret = 1;
        }
        else
        {
            // Found no cell for tentative change and yet the board is not solved.
            // We have to backtrack to the previous guess and change it.
            throw new BoardSanityException("Cannot find candidate for guess");
        }

        return ret;
    }

    /**
     * Backtracks on the history to the previous guess that allows new guesses.
     *
     *
     * @param board board
     * @param pickNextDigit true means we can pick a new guess digit in the guess cell
     * @return number of hits forward; 0 or 1
     * @throws BoardSanityException
     */
    //todo get rid of pickNextDigit
    public int backtrack(Board board, boolean pickNextDigit) throws BoardSanityException
    {
        int ret = 0;

        // todo improve history encapsulation
        // todo let history or board handle unraveling till previous guess.

        // Rollback history, one change at a time, until the previous usable guess point.
        final Deque<CellChange> history = board.getHistory();
        boolean loop = true;
        int undoCount = 0;
        while (loop)
        {
            // Undo change
            final CellChange cellChange = history.peekLast();
            final Cell cell = cellChange.getCell();

            if (cellChange.getReason() == CellChange.Reason.INIT)
            {
                // We don't rollback the initial board.
            }
            else
            {
                LOG.info("backtrack: Undoing change=" + cellChange);
                cell.unchange(cellChange);
                undoCount++;

                // Is this a guess point?
                if (cellChange.getReason() == CellChange.Reason.SOLVER_GUESS)
                {
                    // Analyse the old guess and determine new guess candidates

                    final CellState cellStateAfter = cellChange.getCellStateAfter();
                    final CellState cellStateBefore = cellChange.getCellStateBefore();
                    final int oldGuessDigit = cellStateAfter.getDigit();

                    // Mask off flags for failed old guesses and see what remains.
                    final int digitFlagsLessGuess = cellStateBefore.getDigitFlags() >> (oldGuessDigit+1) << (oldGuessDigit+1);

                    // Any candidate left?
                    if (digitFlagsLessGuess != 0)
                    {
                        // There still are candidates.
                        LOG.info("backtrack: Undone " + undoCount);

                        // We pick a replacement digit if we are allowed or there is only one left anyway
                        if (pickNextDigit || CellState.countDigitFlags(digitFlagsLessGuess) == 1)
                        {
                            // Let's pick a new guess

                            final int newGuessDigit = CellState.getFirstDigitCandidate(digitFlagsLessGuess);
                            LOG.info("backtrack: Adding newGuessDigit=" + newGuessDigit + ", cell=" + cell);
                            cell.changeToDigit(newGuessDigit, CellChange.Reason.SOLVER_GUESS);
                        }
                        else
                        {
                            // Just turn off the flag for the failed guess
                            LOG.info("backtrack: Eliminating failed candidate oldGuessDigit=" + oldGuessDigit + ", cell=" + cell);
                            cell.changeResetDigitFlags(0x1<<oldGuessDigit, CellChange.Reason.SOLVER_GUESS);
                        }

                        ret = 1;
                        loop = false;
                    }
                    else
                    {
                        // No more guesses available on that cell. We continue backtracking.
                    }
                } else
                {
                    // Not a guess. We continue backtracking.
                }
            }
        }
        return ret;
    }
}
