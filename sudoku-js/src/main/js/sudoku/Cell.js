console && console.log("### Cell.js begin");

(function(ns,lang)
{
    /**
     * @see Game
     */
    //class Cell implements SudokuConstants
    /**
     * Constructor
     *
     * @param board
     * @param row
     * @param col
     */
    //var Cell = function(Board board, final int row, final int col)
    ns.Cell = function(board, row, col) {

        if (!(0 <= row && row < 9 && 0 <= col && col < 9)) {
            throw new lang.IllegalArgumentException("Index out of range");
        }

        // A cell has a immutable pointer to its board and immutable position on the board.
        this._board = board;
        this._row = row;
        this._col = col;

        // The cell state is the only mutable part.
        this._cellState = ns.CellState.INIT_STATE;

    };

    //public int getRow()
    ns.Cell.prototype.getRow = function()
    {
        return this._row;
    };

    //public int getCol()
    ns.Cell.prototype.getCol = function()
    {
        return this._col;
    };

    //public int getIndex()
    ns.Cell.prototype.getIndex = function()
    {
        return this._row * 9 + this._col;
    };


    //public int getBlockIndex()
    ns.Cell.prototype.getBlockIndex = function()
    {
        return Math.floor(this._row / 3) * 3 + Math.floor(this._col / 3);
    };

    //public int getIndexInBlock()
    ns.Cell.prototype.getIndexInBlock = function()
    {
        return this._row % 3 * 3 + this._col % 3;
    };

    //CellState getCellState()
    ns.Cell.prototype.getCellState = function()
    {
        return this._cellState;
    };

    //change state to digit
    //todo return change instance including changed flags
    //CellChange changeToDigit(final int digit, CellChange.Reason reason) throws BoardSanityException
    ns.Cell.prototype.changeToDigit = function(digit, reason)
    {
        let ret;
        if (this._cellState.isDigit(digit))
        {
            // The cell already is that digit. No change.
            //todo log
            ret = null;
        }
        else
        {
            // For consistency with other sanity checks, if we throw an exception, we do it after the change is added
            // to the board history. This way, exception handlers know how to reverse the change.
            //todo fix ugly; might use exception to indicate if a change was made.
            let bse = null;
            if (ns.SudokuConstants.CHECK_SANITY)
            {
                if (this._cellState.isDigit(digit))
                {
                    bse = new ns.BoardSanityException("Attempting to change to same digit ("+digit+") in cell " + this);
                    this.LOG.error("changeCellDigit: throwing " + bse);
                }
                else if (!this._cellState.includesDigit(digit))
                {
                    bse = new ns.BoardSanityException("Attempting to change to unavailable digit ("+digit+") in cell " + this);
                    this.LOG.error("changeCellDigit: throwing " + bse);
                }
            }

            ret = this.changeState(ns.CellState.KNOWN_DIGIT_STATE[digit], reason);

            if (bse != null) throw bse;
        }

        return ret;
    };

    /**
     * Centralizes state changes to record and publish the change.
     * The change is sent to the board for it to record history.
     * Events mey be published to observers.
     *
     * @param newState new state
     * @param reason reason for change
     */
    //CellChange changeState(final CellState newState, final CellChange.Reason reason) throws BoardSanityException
    ns.Cell.prototype.changeState = function(newState, reason)
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


        let oldState = this._cellState;
        this._cellState = newState;
        let ret = new ns.CellChange(this, oldState, this._cellState, reason);

        // Notify board of the change
        if (this._board) this._board.changedCell(ret, true);

        return ret;
    };

    /**
     * Reverses the given change. Used to backtrack in history.
     *
     * @param cellChange change to reverse
     */
    //void unchange(CellChange cellChange) throws BoardSanityException
    ns.Cell.prototype.unchange = function(cellChange)
    {
        // Make sure not to record this change in history.
        this._cellState = cellChange.getCellStateBefore();


        // Notify board of the change reversal.
        if (this._board) this._board.changedCell(cellChange, false);

        //todo Publish reversal effect for observers
    };


    /**
     * Applies the given mask to reset value flags.
     *
     * @param digitsMask bit mask
     * @param reason reason for change
     * @return the mask representing the values flags that were reset
     */
    //public int changeResetDigitFlags(final int digitsMask, final CellChange.Reason reason) throws BoardSanityException
    ns.Cell.prototype.changeResetDigitFlags = function(digitsMask, reason)
    {
        const digitFlagsBefore = this._cellState.getDigitFlags();
        const digitFlagsAfter = digitFlagsBefore & ~digitsMask;

        if (digitFlagsBefore !== digitFlagsAfter)
        {
            this.changeState(new ns.CellState(digitFlagsAfter), reason);
        }

        return digitFlagsBefore & digitsMask;
    };


    //int getDigit()
    ns.Cell.prototype.getDigit = function()
    {
        return this._cellState.getDigit();
    };

    //int getUiDigit()
    ns.Cell.prototype.getUiDigit = function()
    {
        return this._cellState.getDigit() + 1;
    };

    //String getUiDigitFlagsString()
    ns.Cell.prototype.getUiDigitFlagsString = function()
    {
        return this._cellState.getUiDigitFlagsString();
    };

    //@Override
    //public int hashCode()
    ns.Cell.prototype.hashCode = function()
    {
        //todo
        //return super.hashCode();
        return 1023;
    };

    ns.Cell.prototype.toString = function()
    {
        return "Cell{" +
                "_row=" + this._row +
                ", _col=" + this._col +
                ", _cellState=" + this._cellState +
                '}';
    };

    //boolean isSingleDigit()
    ns.Cell.prototype.isSingleDigit = function()
    {
        return this._cellState.isSingleDigit();
    };

    //public int getDigitFlags()
    ns.Cell.prototype.getDigitFlags = function()
    {
        return this._cellState.getDigitFlags();
    };

    //@Override
    //public boolean equals(Object o)
    ns.Cell.prototype.equals = function(o)
    {
        if (this === o) return true;
        if (o === null || getClass() !== o.getClass()) return false;

        let cell = o;

        if (this._col !== cell._col) return false;
        if (this._row !== cell._row) return false;

        return true;
    };

}(Module("sudoku"),Module("lang")));

console && console.log("### Cell.js end");
