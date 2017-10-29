/**
 * Game is the main class. It owns the board and its change history.
 * The board contains a matrix of 9x9 cells.
 * Each cell has a state telling how much is known about the cell value.
 * A game is created empty and then populated by a series of changes, i.e. its prehistory before we start playing.
 * Each move by the player or the solver is a change that mutates the state of a cell and is added to the history.
 * Individual history changes can be undone to revert to a previous game state.
 * Some changes are tentative, e.g. when the solver is testing guesses. The solver search can use the history to
 * backtrack.
 *
 * Internal cell indexing is zero based, e.g. the row index range is 0..8.
 * Internal cell digits are zero based, in 0..8 range.
 * UI cell digits are in 1..9 range.
 *
 *
 * TODO stream of changes
 * TODO mechanism to control flow of new changes
 * TODO GUI
 * TODO listeners for change events
 * TODO Investigate if we can do a 16x16 version using hexadecimal digits
 * TODO Investigate if we can do a 25x25 version using base 25 digits
 *
 */
//class Game
let Game = function(board)
{
    this.LOG = Game.LOG;

    //private final Board _board;

    this._board = board || new Board();

//    /**
//     * Changes a cell to set it digit.
//     *
//     * @param cellIndex cell index
//     * @param digit in 0..8 range
//     * @param reason
//     */
//    void changeCellDigit(final int cellIndex, final int digit, CellChange.Reason reason)
//    {
//        //todo transactionallity of state change
//        //todo inline
//
//
//        final Cell cell = board.getCell(cellIndex);
//        final CellChange cellChange = cell.changeToDigit(digit, reason);
//        _history.add(cellChange); //assumption: not nul
//    }

};

Board.protoptype.getBoard = function()
{
    return this._board;
};

Game.prototype.LOG = Game.LOG = Logger.getLogger("Game");
