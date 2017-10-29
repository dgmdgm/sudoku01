package com.dmarchesseault.sudoku;

import com.dmarchesseault.sudoku.*;
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
        LOG.debug("apply: begin");

        int ret = 0;

        //TODO rewrite using applyOnce()

        int loopHits = 1; // temp value to enter loop
        while (board.notSolved() && loopHits > 0)
        {
            loopHits = 0;

            try
            {
                // Apply scans as fas as it goes
                if (board.notSolved())
                {
                    final int scanHits =_solverStrategyScan.apply(board);
                    LOG.info("apply: "+scanHits+" scan hits");
                    loopHits += scanHits;
                }

                // Apply search once
                if (board.notSolved())
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

        if (LOG.isDebugEnabled())
        {
            LOG.debug("apply:\n" + SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug("apply:\n" + SudokuHelper.printBoardDigitFlags(board));
            LOG.debug("apply: end, ret="+ret);
        }
        return ret;
    }

    @Override
    int applyOnce(Board board) throws BoardSanityException
    {
        LOG.debug("applyOnce: begin");

        int ret = 0;

        try
        {
            // Apply scans as fas as it goes
            if (ret == 0 && board.notSolved())
            {
                final int scanHits =_solverStrategyScan.applyOnce(board);
                LOG.info("applyOnce: "+scanHits+" scan hits");
                ret += scanHits;
            }

            // Apply search once
            if (ret == 0 && board.notSolved())
            {
                final int searchHits = _solverStrategySearch.applyOnce(board);
                LOG.info("applyOnce: "+searchHits+" search hits");
                ret += searchHits;
            }
        }
        catch (BoardSanityException e)
        {
            // We have to handle the exceptions the rollback may throw
            BoardSanityException bse = e;
            while (bse != null) {
                try
                {
                    LOG.info("applyOnce: Rolling back changes because of sanity issue", bse);

                    final int searchHits = _solverStrategySearch.backtrack(board, true);
                    LOG.info("apply: "+searchHits+" search hits after rollback");
                    ret = searchHits;
                    bse = null; // break loop
                }
                catch (BoardSanityException e1)
                {
                    bse = e1;
                }
            }
        }

        if (LOG.isDebugEnabled())
        {
            LOG.debug("applyOnce:\n" + SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug("applyOnce:\n" + SudokuHelper.printBoardDigitFlags(board));
            LOG.debug("applyOnce: end, ret="+ret);
        }
        return ret;
    }

}
