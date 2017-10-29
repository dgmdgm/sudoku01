console && console.log("### SolverStrategySearch.js begin");


(function(ns)
{

    /**
     * Solver strategy that does a depth first search to try to assign value to cells.
     */
    //class SolverStrategySearch extends SolverStrategy

    // Constructor
    ns.SolverStrategySearch = function(){

    };

    ns.SolverStrategySearch.prototype.LOG = ns.SolverStrategySearch.LOG = Logger.getLogger("SolverStrategySearch");


    //@Override
    //int apply(Board board) throws BoardSanityException
    ns.SolverStrategySearch.prototype.apply = function(board){
        let ret = 0;

        let loopHits = 1; //temp value to enter loop
        while (board.notSolved() && loopHits > 0)
        {
            try
            {
                loopHits = this.applyOnce(board);
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
                            this.LOG.info("Rolling back changes because of sanity issue", bse);

                            // We disallow picking the next digit for pure search, otherwise we risk exception within this catch.
                            const searchHits = this.backtrack(board, true);
                            this.LOG.info("apply: " + searchHits + " search hits after rollback");
                            loopHits = 1;
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
            ret += loopHits;
        }
        return ret;
    };

    /**
     *
     * @param board board
     * @return number of hits
     * @throws BoardSanityException
     */
    //int applyOnce(Board board) throws BoardSanityException
    ns.SolverStrategySearch.prototype.applyOnce = function(board){
        let ret;

        // Find cell with the least number of candidates
        // Fewer candidates should improve the odds of a good guess and lead to a smaller search tree.

        const cells = board.getCells();
        let  bestCell = null;
        let bestDigitsFlagsCount = 9+1; //temp value such that anything will be better
        let unknownDigitCells = 0;      // How many cell are still unknown
        for(let cellKey in cells){
            const cell = cells[cellKey];
            const digitFlagsCount = cell.getCellState().getDigitFlagsCount();
            if (digitFlagsCount > 1)
            {
                unknownDigitCells++;
                if (digitFlagsCount < bestDigitsFlagsCount)
                {
                    bestCell = cell;
                    bestDigitsFlagsCount = digitFlagsCount;
                }
            }
            else if (digitFlagsCount === 1)
            {
                // Solved cell. Just skip it.
            }
            else
            {
                ns.SolverStrategySearch.LOG.warn("applyOnce: Integrity problem; no flags in cell " + cell);
            }
        }

        if (unknownDigitCells === 0)
        {
            // This board is solved. Nothing to do
            //todo try to check this earlier
            ret = 0;
        }
        else if (bestCell != null)
        {
            // Found a cell to make a tentative change.

            const digit = bestCell.getCellState().getFirstDigitCandidate();
            this.LOG.info("apply: Guessing hit, digit="+digit+", cell=" + bestCell);
            bestCell.changeToDigit(digit, ns.CellChange.Reason.SOLVER_GUESS);
            ret = 1;
        }
        else
        {
            // Found no cell for tentative change and yet the board is not solved.
            // We have to backtrack to the previous guess and change it.
            throw new ns.BoardSanityException("Cannot find candidate for guess");
        }

        return ret;
    }
    ;

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
    //public int backtrack(Board board, boolean pickNextDigit) throws BoardSanityException
    ns.SolverStrategySearch.prototype.backtrack = function(board, pickNextDigit){
        let ret = 0;

        // todo improve history encapsulation
        // todo let history or board handle unraveling till previous guess.

        // Rollback history, one change at a time, until the previous usable guess point.
        const history = board.getHistory();
        let loop = true;
        let undoCount = 0;
        while (loop) //risk of infinite loop
        {
            // Undo change
            const cellChange = history.peekLast();
            const cell = cellChange.getCell();

            if (cellChange.getReason() === ns.CellChange.Reason.INIT)
            {
                // We don't rollback the initial board.
            }
            else
            {
                this.LOG.info("backtrack: Undoing change=" + cellChange);
                cell.unchange(cellChange);
                undoCount++;

                // Is this a guess point?
                if (cellChange.getReason() === ns.CellChange.Reason.SOLVER_GUESS)
                {
                    // Analyse the old guess and determine new guess candidates

                    const cellStateAfter = cellChange.getCellStateAfter();
                    const cellStateBefore = cellChange.getCellStateBefore();
                    const oldGuessDigit = cellStateAfter.getDigit();

                    // Mask off flags for failed old guesses and see what remains.
                    const digitFlagsLessGuess = cellStateBefore.getDigitFlags() >> (oldGuessDigit+1) << (oldGuessDigit+1);

                    // Any candidate left?
                    if (digitFlagsLessGuess !== 0)
                    {
                        // There still are candidates.
                        this.LOG.info("backtrack: Undone " + undoCount);

                        // We pick a replacement digit if we are allowed or there is only one left anyway
                        if (pickNextDigit || ns.CellState.countDigitFlags(digitFlagsLessGuess) === 1)
                        {
                            // Let's pick a new guess

                            const newGuessDigit = ns.CellState.getFirstDigitCandidate(digitFlagsLessGuess);
                            this.LOG.info("backtrack: Adding newGuessDigit=" + newGuessDigit + ", cell=" + cell);
                            cell.changeToDigit(newGuessDigit, ns.CellChange.Reason.SOLVER_GUESS);
                        }
                        else
                        {
                            // Just turn off the flag for the failed guess
                            this.LOG.info("backtrack: Eliminating failed candidate oldGuessDigit=" + oldGuessDigit + ", cell=" + cell);
                            cell.changeResetDigitFlags(0x1<<oldGuessDigit, ns.CellChange.Reason.SOLVER_GUESS);
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
    };

}(Module("sudoku")));

console && console.log("### SolverStrategySearch.js end");
