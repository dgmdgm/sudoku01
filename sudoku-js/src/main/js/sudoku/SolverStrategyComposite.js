console && console.log("### SolverStrategyComposite.js begin");

/**
 * Solver strategy that uses a mix of other strategies.
 */
//class SolverStrategyComposite extends SolverStrategy

(function(ns)
{
    // Constructor
    ns.SolverStrategyComposite = function()
    {
        this._solverStrategyScan = new ns.SolverStrategyScan();
        this._solverStrategySearch = new ns.SolverStrategySearch();
    };

    const LOG = ns.SolverStrategyComposite.prototype.LOG = ns.SolverStrategyComposite.LOG = Logger.getLogger("SolverStrategyComposite");

    //@Override
    //public int apply(final Board board) throws BoardSanityException
    ns.SolverStrategyComposite.prototype.apply = function(board)
    {
        LOG.debug("apply: begin");
        let ret = 0;

        let loopHits = 1; // temp value to enter loop
        while (board.notSolved() && loopHits > 0)
        {
            loopHits = 0;

            try
            {
                // Apply scans as fas as it goes
                if (board.notSolved())
                {
                    const scanHits = this._solverStrategyScan.apply(board);
                    LOG.info("apply: "+scanHits+" scan hits");
                    loopHits += scanHits;
                }

                // Apply search once
                if (board.notSolved())
                {
                    const searchHits = this._solverStrategySearch.applyOnce(board);
                    LOG.info("apply: "+searchHits+" search hits");
                    loopHits += searchHits;
                }

                ret += loopHits;
            }
            //catch (BoardSanityException e)
            catch (e)
            {
                if (e instanceof ns.BoardSanityException)
                {
                    // We have to handle the exceptions the rollback may throw
                    let bse = e;
                    while (bse) {
                        try
                        {
                            LOG.info("apply: Rolling back changes because of sanity issue", bse);

                            const searchHits = this._solverStrategySearch.backtrack(board, true);
                            LOG.info("apply: "+searchHits+" search hits after rollback");
                            loopHits = searchHits;
                            bse = null; // break loop
                        }
                        //catch (BoardSanityException e1)
                        catch (e1)
                        {
                            if (e instanceof ns.BoardSanityException)
                            {
                                bse = e1;
                            }
                            else
                            {
                                throw e1;
                            }
                        }
                    }
                }
                else
                {
                    throw e;
                }
            }
        }

        if (LOG._isDebugOn) {
            LOG.debug("apply:\n" + ns.SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug("apply:\n" + ns.SudokuHelper.printBoardDigitFlags(board));
            LOG.debug("apply: end, ret=" + ret);
        }

        return ret;
    };

    //@Override
    //int applyOnce(Board board) throws BoardSanityException
    ns.SolverStrategyComposite.prototype.applyOnce = function(board) {
        LOG.debug("applyOnce: begin");

        let ret = 0;

        try
        {
            // Apply scans as fas as it goes
            if (ret === 0 && board.notSolved())
            {
                const scanHits = this._solverStrategyScan.applyOnce(board);
                LOG.info("applyOnce: "+scanHits+" scan hits");
                ret += scanHits;
            }

            // Apply search once
            if (ret == 0 && board.notSolved())
            {
                const searchHits = this._solverStrategySearch.applyOnce(board);
                LOG.info("applyOnce: "+searchHits+" search hits");
                ret += searchHits;
            }
        }
        catch (e)
        {
            if (e instanceof ns.BoardSanityException)
            {
                // We have to handle the exceptions the rollback may throw
                let bse = e;
                while (bse) {
                    try
                    {
                        LOG.info("applyOnce: Rolling back changes because of sanity issue", bse);

                        const searchHits = this._solverStrategySearch.backtrack(board, true);
                        LOG.info("apply: "+searchHits+" search hits after rollback");
                        ret = searchHits;
                        bse = null; // break loop
                    }
                    catch (e1)
                    {
                        if (e instanceof ns.BoardSanityException)
                        {
                            bse = e1;
                        }
                        else
                        {
                            throw e1;
                        }
                    }
                }
            }
            else
            {
                throw e;
            }
        }

        if (LOG._isDebugOn)
        {
            LOG.debug("applyOnce:\n" + SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug("applyOnce:\n" + SudokuHelper.printBoardDigitFlags(board));
            LOG.debug("applyOnce: end, ret="+ret);
        }
        return ret;
    }


}(Module("sudoku")));

console && console.log("### SolverStrategyComposite.js end");


