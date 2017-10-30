console && console.log("### Board.js begin");

/**
 * @author  Denis Marchesseault
 */

(function(ns, lang, util)
{
    //class Board implements SudokuConstants
    ns.Board = function()
    {
        // For convenience, cells can be accessed in multiple ways
        //todo add support for sudoku variants with more constraints, e.g. diagonals, etc

        // Access by linear index in 0..80 range
         this._cells = new Array(9*9);

        // Access by [row,col] indices. Top left is 0,0; top right is 0,8; bottom right is 8,8.
        this._cellsByRow = new Array(9);
        for (let row=0; row<9; row++) this._cellsByRow[row] = new Array(9);

        // Access by [col,row] indices
        this._cellsByCol = new Array(9);
        for (let col=0; col<9; col++) this._cellsByCol[col] = new Array(9);


        // Access grouped by 3x3 block.
        // Blocks are indexed 0..8 from top left to bottom right. Top right is block 2
        this._cellsByBlock = new Array(9);
        for (let block=0; block<9; block++) this._cellsByBlock[block] = new Array(9);

        // All the groups together. Useful for scans.
        this._cellGroups = new Array(3*9);
        for (let k=0; k<9; k++) this._cellsByRow[k] = new Array(9);

        //todo queue or deque?; concurrent needed?
        this._history = new util.Deque();

        // The number of cells with a single digit, i.e. solved cells.
        this._knownDigitsCount = 0;

        // For testing, we can have a solution to compare with.
        this._solutionBoard = null;

        for (let row = 0; row < 9; row++)
        {
            for (let col = 0; col < 9; col++)
            {
                let cell = new ns.Cell(this, row, col);
                this._cells[row * 9 + col] = cell;
                this._cellsByRow[row][col] = cell;
                this._cellsByCol[col][row] = cell;
                //LOG.trace("_cellsByBlock["+cell.getBlockIndex()+"]["+cell.getIndexInBlock()+"]");
                this._cellsByBlock[cell.getBlockIndex()][cell.getIndexInBlock()] = cell;
            }
        }

        for (let k = 0; k < 9; k++)
        {
            this._cellGroups[k] = this._cellsByRow[k];
            this._cellGroups[9+k] = this._cellsByCol[k];
            this._cellGroups[18+k] = this._cellsByBlock[k];
        }
    };

    
    const LOG = ns.Board.prototype.LOG = ns.Board.LOG = Logger.getLogger("Board");

    
    //Cell[] getCells()
    ns.Board.prototype.getCells = function()
    {
        return this._cells;
    };
    

    /**
     * Dispatches call to pseudo-overloaded methods
     */
    ns.Board.prototype.getCell = function()
    {
        switch (arguments.length) {
            case 1: return ns.Board.prototype.getCell1.apply(this,arguments); break;
            case 2: return ns.Board.prototype.getCell2.apply(this,arguments); break;
            case 4: return ns.Board.prototype.getCell4.apply(this,arguments); break;
            default: throw new lang.IllegalArgumentException("");
        }
    };

    
    /**
     * Returns the cell addressed with a linear index.
     * The ordering is cells in first row, then second row, ...
     *
     * @param index in range [0..80]
     * @return cell
     */
    //Cell getCell(final int index)
    ns.Board.prototype.getCell1 = function(index)
    {
        return this._cellsByRow[Math.floor(index / 9)][index % 9];
    };

    
    //Cell[][] getCellsByRow()
    ns.Board.prototype.getCellsByRow = function()
    {
        return this._cellsByRow;
    };

    
    //Cell[][] getCellsByCol()
    ns.Board.prototype.getCellsByCol = function()
    {
        return this._cellsByCol;
    };

    
    //Cell[][] getCellsByBlock()
    ns.Board.prototype.getCellsByBlock = function()
    {
        return this._cellsByBlock;
    };

    
    //Cell[][] getCellGroups()
    ns.Board.prototype.getCellGroups = function()
    {
        return this._cellGroups;
    };
    

    /**
     * Returns the cell addressed by row and column.
     *
     * @param row in range 0..8
     * @param col in range 0..8
     * @return cell
     */
    //Cell getCell(final int row, final int col)
    ns.Board.prototype.getCell2 = function(row, col)
    {
        return this._cellsByRow[row][col];
    };

    
    /**
     * Returns the cell addressed in a 3x3 block.
     *
     * @param blockRow in range 0..2
     * @param blockCol in range 0..2
     * @param rowInBlock in range 0..2
     * @param colInBlock in range 0..2
     * @return cell
     */
    //Cell getCell(final int blockRow, final int blockCol, final int rowInBlock, final int colInBlock)
    ns.Board.prototype.getCell4 = function(blockRow, blockCol, rowInBlock, colInBlock)
    {
        if (SudokuConstants.CHECK_SANITY)
        {
            if (!(0 <= blockRow && blockRow < 3))
            {
                throw new ns.IndexOutOfBoundsException("xx ("+blockRow+") not in 0..2 range.");
            }
            if (!(0 <= blockCol && blockCol < 3))
            {
                throw new ns.IndexOutOfBoundsException("yy ("+blockCol+") not in 0..2 range.");
            }
            if (!(0 <= blockRow && blockRow < 3))
            {
                throw new ns.IndexOutOfBoundsException("x ("+rowInBlock+") not in 0..2 range.");
            }
            if (!(0 <= blockCol && blockCol < 3))
            {
                throw new ns.IndexOutOfBoundsException("x ("+colInBlock+") not in 0..2 range.");
            }
        }

        return this._cellsByRow[blockRow*3 + rowInBlock][blockCol * 3 + colInBlock];
    };

    
    //Deque<CellChange> getHistory()
    ns.Board.prototype.getHistory = function()
    {
        return this._history;
    };

    
    //int getUnknownDigitsCount()
    ns.Board.prototype.getUnknownDigitsCount = function()
    {
        return 81 - getKnownDigitsCount(false);
    };


    //int getKnownDigitsCount()
    ns.Board.prototype.getKnownDigitsCount = function()
    {
        return getKnownDigitsCount(false);
    };


    //int getKnownDigitsCount(final boolean recount)
    ns.Board.prototype.getKnownDigitsCount = function(recount)
    {
        if (recount)
        {
           this._knownDigitsCount = 0;
            for (cell in this._cells)
            {
                if (cell.isSingleDigit()) this._knownDigitsCount++;
            }
        }
        return this._knownDigitsCount;
    };
    

    //boolean isSolved()
    ns.Board.prototype.isSolved = function()
    {
        return this._knownDigitsCount === 81;
    };

    
    ns.Board.prototype.notSolved = function()
    {
        return this._knownDigitsCount !== 81;
    };


    //Board getSolutionBoard()
    ns.Board.prototype.getSolutionBoard = function()
    {
        return this._solutionBoard;
    };
    

    //void setSolutionBoard(Board solutionBoard)
    ns.Board.prototype.setSolutionBoard = function(solutionBoard)
    {
       this._solutionBoard = solutionBoard;
    };

    
    /**
     * Called to notify the board that a cell has changed.
     * The board is responsible to add/remove the change to the history
     *
     * @param cellChange cell change
     * @param forward true means to add to history; false means to reverse.
     */
    //Board.prototype.changedCell(CellChange cellChange, boolean forward) throws BoardSanityException
    ns.Board.prototype.changedCell = function(cellChange, forward)
    {
        if (forward)
        {
            LOG.debug("changedCell: Adding change=" + cellChange + ", history size before is " +this._history.size());
            this._history.add(cellChange);

            // Detect if the change is solving the cell.
            if (!cellChange.getCellStateBefore().isSingleDigit() && cellChange.getCellStateAfter().isSingleDigit())
            {
               this._knownDigitsCount++;
            }
        }
        else
        {
            LOG.debug("changedCell: Removing change=" + cellChange + ", history size before is " +this._history.size());
            //todo should check it matches
            removedChange = this._history.removeLast();
            if (removedChange !== cellChange)
            {
                LOG.error("changedCell: Reversal mismatch, change=" + cellChange + ", removedChange=" + removedChange);
            }

            // Detect if the change was solving the cell.
            if (!cellChange.getCellStateBefore().isSingleDigit() && cellChange.getCellStateAfter().isSingleDigit())
            {
               this._knownDigitsCount--;
            }
        }

        if (LOG._isDebugOn)
        {
            LOG.debug("changedCell:\n" + ns.SudokuHelper.printBoardDigits(this, '.'));
            LOG.debug("changedCell:\n" + ns.SudokuHelper.printBoardDigitFlags(this));
        }

        if (ns.SudokuConstants.CHECK_SANITY )
        {
            let diagnostics = this.checkSanity();
            if (diagnostics)
            {
                LOG.warn("changeState: Sanity problem after change, "+diagnostics.size()+" diagnostics.");
                for (let i=0; i<diagnostics.size(); i++) LOG.debug("changeState: diagnostic("+i+")=" + diagnostics.get(i));
            }
        }
    };


    /**
     * Unwinds the last change in the board history.
     *
     * @retu
     */
    //CellChange undoLastChange() throws BoardSanityException
    ns.Board.prototype.undoLastChange = function()
    {
        // Undoing changes is tricky
        // We can pop the last change in the history but that does restore the other cells
        // What we need is a history not just of cell change but of full board states

        //todo UNSURE IMPLEMENTATION
        const cellChange = this._history.peekLast();
        cellChange.getCell().unchange(cellChange);
        return cellChange;
    };

    /**
     * Performs a sanity check and generates diagnostics.
     *
     * @return null if no problem detected, diagnostics otherwise.
     */
    //List<String> checkSanity() throws BoardSanityException
    ns.Board.prototype.checkSanity = function()
    {
        diagnostics = [];

        for (let index in this._cells)
        {
            const cell = this._cells[index];
            const flags = cell.getDigitFlags();
            const MASK_OFF_ALL_FLAGS = ~ns.CellState.ALL_FLAGS;

            // Check if the cell has invalid flags
            if (flags === 0)
            {
                diagnostics.push("No flags in " + cell + "; ");
                throw new ns.BoardSanityException("No flags in " + cell);
            }
            if ((flags & MASK_OFF_ALL_FLAGS) !== 0)
            {
                throw new ns.BoardSanityException("Unexpected flags in " + cell);
    //                diagnostics.push("Unexpected flags in " + cell);
            }

            // Check against solution board
            if (ns.SudokuConstants.CHECK_SANITY_DEEP && this._solutionBoard)
            {
                let solutionCell = this._solutionBoard.getCell(cell.getRow(), cell.getCol());
                let solutionFlags = solutionCell.getDigitFlags();
                // Flags in the cell of this board must be a superset of the flags in the solution cell.
                if ((flags & solutionFlags) !== solutionFlags)
                {
                    diagnostics.push("Divergence from solution. cell=" + cell + ", solutionCell=" + solutionCell);
                }
            }
        }

        for (let groupIndex in this._cellGroups)
        {
            let cellGroup = this._cellGroups[groupIndex];

            // No two cells in a group can have the same digit
            for (let iA = 0; iA < 9; iA++)
            {
                let cellA = cellGroup[iA];
                let cellStateA = cellA.getCellState();
                let digitA = cellStateA.getDigit();
                if (digitA !== -1)
                {
                    // Cell A has a solution digit. Check other cells in the group for a colliding solution.

                    let flagsA = cellStateA.getDigitFlags();
                    for (let iB = iA+1; iB < 9; iB++)
                    {
                        let cellB = cellGroup[iB];
                        let cellStateB = cellB.getCellState();
                        let flagsB = cellStateB.getDigitFlags();
                        if (flagsB === flagsA)
                        {
                            throw new ns.BoardSanityException("Digit " + digitA + " collision between cells " + cellA + cellB);
    //                            diagnostics.push("Digit " + digitA + " collision between cells " + cellA + cellB);
                        }
                    }
                }
            }
        }

        return (diagnostics.length > 0) ? diagnostics : null;
    };
    
}(Module("sudoku"), Module("lang"), Module("util")));

console && console.log("### Board.js end");
