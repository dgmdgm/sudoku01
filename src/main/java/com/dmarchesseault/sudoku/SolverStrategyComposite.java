package com.dmarchesseault.sudoku;

import org.apache.log4j.Logger;

/**
 * Solver strategy that uses a mix of other strategies.
 */
class SolverStrategyComposite extends SolverStrategy
{
    private static final Logger LOG = Logger.getLogger(SolverStrategyComposite.class);

    private final SolverStrategyScan _solverStrategyScan = new SolverStrategyScan();
    private final SolverStrategySearch _solverStrategySearch = new SolverStrategySearch();

    @Override
    public int apply(final Board board) throws BoardSanityException
    {
        int ret = 0;

        int loopHits = 1; // temp value to enter loop
        while (!board.isSolved() && loopHits > 0)
        {
            loopHits = 0;

            try
            {
                // Apply scans as fas as it goes
                if (!board.isSolved())
                {
                    final int scanHits =_solverStrategyScan.apply(board);
                    LOG.info("apply: "+scanHits+" scan hits");
                    loopHits += scanHits;
                }

                // Apply search once
                if (!board.isSolved())
                {
                    final int searchHits = _solverStrategySearch.applyOnce(board);
                    LOG.info("apply: "+searchHits+" search hits");
                    loopHits += searchHits;
                }

                ret += loopHits;
            }
            catch (BoardSanityException e)
            {
                // We have to handle the exceptions the rollback may throw
                BoardSanityException bse = e;
                while (bse != null) {
                    try
                    {
                        LOG.info("Rolling back changes because of sanity issue", bse);

                        final int searchHits = _solverStrategySearch.backtrack(board, true);
                        LOG.info("apply: "+searchHits+" search hits after rollback");
                        loopHits = searchHits;
                        bse = null; // break loop
                    }
                    catch (BoardSanityException e1)
                    {
                        bse = e1;
                    }
                }
            }
        }

        LOG.info("apply: end:\n" + SudokuHelper.printBoardDigits(board, '.'));
        LOG.info("apply: end:\n" + SudokuHelper.printBoardDigitFlags(board));

        return ret;
    }

}
