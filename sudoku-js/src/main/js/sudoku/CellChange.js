console && console.log("### CellChange.js begin");

(function(ns)
{
    /**
     * Represents any change to a board cell.
     * A game can be represented by a sequence of cell changes.
     *
     * @see Game
     */
    //todo immutable
    //class CellChange
    //CellChange(final Cell cell, final CellState cellStateBefore, final CellState cellStateAfter, final Reason reason)
    ns.CellChange = function(cell, cellStateBefore, cellStateAfter, reason)
    {
        this._cell = cell;
        this._cellStateBefore = cellStateBefore;
        this._cellStateAfter = cellStateAfter;
        this._reason = reason;
    };


    ns.CellChange.prototype.getCell = function()
    {
        return this._cell;
    };

    ns.CellChange.prototype.getCellStateBefore = function()
    {
        return this._cellStateBefore;
    };

    ns.CellChange.prototype.getCellStateAfter = function()
    {
        return this._cellStateAfter;
    };

    ns.CellChange.prototype.getReason = function()
    {
        return this._reason;
    };

    ns.CellChange.prototype.toString = function()
    {
        return "CellChange{" +
                "_cell=(" + this._cell.getRow() + "," + this._cell.getCol()+
                "), _cellStateBefore=" + this._cellStateBefore +
                ", _cellStateAfter=" + this._cellStateAfter +
                ", _reason=" + this._reason +
                '}';
    };


    ns.CellChange.Reason = {
        INIT: "INIT" ,                      // Initialization of the board
        PLAYER: "PLAYER",                   // The player set the digit
        SOLVER_GUESS: "SOLVER_GUESS",       // A solver set a digit but it is a reversible
        SOLVER: "SOLVER"                    // A solver changed flags only without setting the digit
    };


}(Module("sudoku")));

console && console.log("### CellChange.js end");
