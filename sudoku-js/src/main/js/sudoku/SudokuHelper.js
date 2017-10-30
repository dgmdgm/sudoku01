console && console.log("### SudokuHelper.js begin");

(function(ns,lang) {
    /// imports

    ////let Assert = ns.Assert;
    //let SudokuConstants = ns.SudokuConstants;
    //let SudokuSamples = ns.SudokuSamples;
    //let Board = ns.Board;
    //let Cell = ns.Cell;
    //let CellState = ns.CellState;
    //let CellChange = ns.CellChange;

    // Constructor
    ns.SudokuHelper = function()
    {
        throw new ns.NotInstantiableException();
    };


    /** Makes a random generator from a given seed.
     * See http://stackoverflow.com/questions/521295/javascript-random-seeds
     * 
     * @param seed number
     * @returns random generator function
     */
    ns.SudokuHelper.makeRamdom = function(seed) {
        var m_w = seed || Date.now(); //default to system clock as seed
        var m_z = 987654321;
        var mask = 0xffffffff;

        return function () {
            m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
            m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

            var result = ((m_z << 16) + m_w) & mask;
            result /= 4294967296;

            return result + 0.5;
        }
    };


    /**
     * Populates board cells using a text representation as in {@link #makeDigitsFromString(String)}.
     *
     * @param board board to populate
     * @param text board content; each character is either a digit or a character we ignore. '.' is treated as '0'.
     */
    //static Board populateBoardFromText(final Board board, final String text) throws BoardSanityException
    ns.SudokuHelper.populateBoardFromText = function(board, text)
    {
        this.LOG.debug("populateBoardFromText: begin");

        const digits = ns.SudokuHelper.makeDigitsFromString(text);
        for (let k = 0; k < digits.length; k++)
        {
            const digit = digits[k];
            if (digit !== -1)
            {
//                board.changeCellDigit(i, digit, CellChange.Reason.INIT);
                board.getCell(k).changeToDigit(digit, ns.CellChange.Reason.INIT);
            }
        }
        this.LOG.debug("populateBoardFromText: end");
        return board;
    };


    /**
     * Populates board cells using a text representation.
     * Digit character in the 1..9 range count as a cell digit.
     * A '0' or '.' indicates an empty cell.
     * Other character are ignored so the string can contain some cosmetic characters, e.g.
     *
     * <pre>
     *  "1........" +
     *  ".2......." +
     *  "..3......" +
     *  "...4....." +
     *  "....5...." +
     *  ".....6..." +
     *  "......7.." +
     *  ".......8." +
     *  "........9";
     * </pre>
     * or
     * <pre>
     *  "+-------+-------+-------+" +
     *  "| 1 . . | . . . | . . . |" +
     *  "| . 2 . | . . . | . . . |" +
     *  "| . . 3 | . . . | . . . |" +
     *  "+-------+-------+-------+" +
     *  "| . . . | 4 . . | . . . |" +
     *  "| . . . | . 5 . | . . . |" +
     *  "| . . . | . . 6 | . . . |" +
     *  "+-------+-------+-------+" +
     *  "| . . . | . . . | 7 . . |" +
     *  "| . . . | . . . | . 8 . |" +
     *  "| . . . | . . . | . . 9 |";
     *  "+-------+-------+-------+" +
     * </pre>
     *
     *
     * @param text board content; each character is either a digit or a character we ignore.
     * @return board digits. Empty cells are -1
     */
    //static int[] makeDigitsFromString(final String text)
    ns.SudokuHelper.makeDigitsFromString = function(text)
    {
        const ret = new Array(9*9);

        // Transform into string with only digits in '0'..'9' range
        //const values = text.replaceAll("\\.", "0").replaceAll("\\D+", "");
        const values = text.replace(/\./g, "0").replace(/\D/g, "");

        if (values.length !== 81)
        {
            throw new lang.IllegalArgumentException("Digit count ("+values.length+") should be 81.");
        }

        for (let k = 0; k < 9*9; k++)
        {
            const digit = values.charAt(k) - '1';
            ret[k] = digit;
        }

        return ret;
    };

    ns.SudokuHelper.printBoardDigits = function(board, emptyCellChar, appendHistory)
    {
        emptyCellChar = emptyCellChar || '.'; //default
        appendHistory = (appendHistory != null) ? appendHistory : true; //default for null and undefined

        let sb = "";

        let knownCount = 0;
        let unknownCount = 0;
        let unknownCandidatesCount = 0;

        for (let row = 0; row < 9; row++)
        {
            if (row % 3 === 0) sb += ("+-------+-------+-------+\n");
            for (let col = 0; col < 9; col++)
            {
                if (col === 0)
                {
                    sb += ("|");
                }
                else if (col % 3 === 0)
                {
                    sb += (" |");
                }
                sb += (" ");
                const cell = board.getCell(row, col);
                const cellState = cell.getCellState();
                const digitFlagsCount = cellState.getDigitFlagsCount();
                if (digitFlagsCount === 1)
                {
                    knownCount++;
                }
                else
                {
                    unknownCount++;
                    unknownCandidatesCount += digitFlagsCount;
                }

                const uiDigit = cell.getUiDigit();
                if (uiDigit === 0)
                {
                    sb += emptyCellChar;
                }
                else
                {
                    sb += uiDigit;
                }
            }
            sb += " |\n";
        }
        sb += "+-------+-------+-------+\n";
        if (appendHistory)
        {
            //sb += String.format("History: %d, Board known digits: %d,  Known: %d, Unknown: %d, Avg candidates per unknown: %4.2f;\n",
            //        board.getHistory().size(), board.getKnownDigitsCount(), knownCount, unknownCount, unknownCandidatesCount/unknownCount);
            sb += "History: " + board.getHistory().size() +
                ", Board known digits: " + board.getKnownDigitsCount()+
                ",  Known: "+knownCount + ", Unknown: "+unknownCount+
                ", Avg candidates per unknown: " +
                unknownCandidatesCount/unknownCount + ";\n";
        }

        return sb.toString();
    };


    ns.SudokuHelper.printBoardDigitFlags = function(board)
    {
        let sb = "";

        for (let row = 0; row < 9; row++)
        {
            if (row % 3 === 0) sb += "+-------------------------------+-------------------------------+-------------------------------+\n";
            for (let col = 0; col < 9; col++)
            {
                if (col === 0)
                {
                    sb += "|";
                }
                else if (col % 3 === 0)
                {
                    sb += " |";
                }
                sb += " ";
                const value = board.getCell(row, col).getUiDigitFlagsString();
                sb += value;
            }
            sb += " |\n";
        }
        sb += "+-------------------------------+-------------------------------+-------------------------------+\n";
        return sb;
    };


    /**
     * Populates the board with random digits
     *
     * @param n number of digits.
     */
    //todo Buggy. May fail to fill n cells. Board may be invalid.
    //static void populateBoardRandomly(final Board targetBoard, final int n)
    ns.SudokuHelper.populateBoardRandomly1 = function(targetBoard, n, seed)
    {
        if (targetBoard.getKnownDigitsCount() > 0)
        {
            //todo board not empty
        }
        if (!(0 <= n && n <= 81))
        {
            throw new lang.IllegalArgumentException("Expecting n in 0..81 range");
        }
        if (seed != null) seed = Date.now();

        //todo add safeguard to prevent infinite loop

        const random = ns.SudokuHelper.makeRamdom(seed);

        // To avoid collisions from cell index reuse, we use a list of indices and remove them one by one.
        //const List<Integer> cellChoices = new ArrayList<Integer>(81);
        const cellChoices = [];
        for (let i = 0; i < 81; i++) cellChoices.push(i);

        let cellCount = 0;
        // Loop until we have reached the target number of cells or we exhausted the choices
        while (cellCount < n && cellChoices.length > 0)
        {
            // Pick random cell index in 0..80 range
            const cellChoice = Math.floor(random() * cellChoices.length);
            const cellIndex = cellChoices.splice(cellChoice,1);

            //final List<Integer> digitChoices = new ArrayList<Integer>(9);
            const digitChoices = [];
            for (let i = 0; i < 9; i++) digitChoices.push(i);

            let digitCount = 0;
            // Loop until we have a digit or we exhausted the choices
            while (digitCount < 1 && digitChoices.size() > 0)
            {
                // Pick random digit in 0..8 range
                const digitChoice = Math.floor(random() * digitChoices.size());
                const digit = digitChoices.splice(digitChoice,1);
                const targetCell = targetBoard.getCell(cellIndex);

                try
                {
                    targetCell.changeToDigit(digit, ns.CellChange.Reason.INIT);
                    digitCount++;
                }
                catch (e)
                {
                    if (e._type === "BoardSanity")
                    {
                        // Oups, that digit conflicts
                        this.LOG.debug("populateBoardRandomly", e);
                        // Undo change
                        const cellChange = targetBoard.getHistory().peekLast();
                        try
                        {
                            cellChange.getCell().unchange(cellChange);
                        }
                        catch (e1)
                        {
                            this.LOG.debug("populateBoardRandomly: unexpected problem", e1);
                        }
                    }
                    else
                    {
                        throw e;
                    }
                }
            }
            cellCount += digitCount;
        }
    };


    /**
     * Populates the board with random digits.
     * Starts with a full board and removes cells.
     * Applies random permutations of rows and columns.
     *
     * @param n target number of solved cells
     */
    //static void populateBoardRandomly2(final Board targetBoard, final int n)
    ns.SudokuHelper.populateBoardRandomly2 = function(targetBoard, n, seed)
    {
        if (targetBoard.getKnownDigitsCount() > 0)
        {
            throw new lang.IllegalArgumentException("Board should be empty");
        }
        if (!(0 <= n && n <= 81))
        {
            throw new lang.IllegalArgumentException("Expecting n in 0..81 range");
        }
        if (seed != null) seed = Date.now();

        //todo Allow control of the seed, e.g. stored on the board.
        //Start from canonical board
        const sourceBoard = new ns.Board();
        try
        {
            ns.SudokuHelper.populateBoardFromText(sourceBoard, ns.SudokuSamples.SUDOKU_BOARD_CANONICAL2);
        }
        catch (e)
        {
            // should not happen with known good board
            //todo handle exception
            //e.printStackTrace();
        }

        // Make random permutation
        const pRow = this.makeRowPermutation(seed);
        const pCol = this.makeRowPermutation(seed+13);

        // To avoid collisions from cell index reuse, we use a list of indices and remove them randomly until
        // we have just enough
        const cellChoices = new Array(81);
        for (let i = 0; i < 81; i++) cellChoices[i]=i;
        const random = ns.SudokuHelper.makeRamdom();
        while (cellChoices.length > n)
        {
            const cellChoice = Math.floor(random() * cellChoices.length);
            cellChoices.splice(cellChoice,1);
        }

        for (let key in cellChoices)
        {
            const cellIndex = cellChoices[key];
            const sourceCell = sourceBoard.getCell(cellIndex);
            const sourceRow = sourceCell.getRow();
            const sourceCol = sourceCell.getCol();
            const targetRow = pRow[sourceRow];
            const targetCol = pCol[sourceCol];

            try
            {
                const sourceDigit = sourceCell.getDigit();
                targetBoard.getCell(targetRow,targetCol).changeToDigit(sourceDigit, ns.CellChange.Reason.INIT);
            }
            catch (e)
            {
                // There should not be exceptions if the source board is valid.
                LOG.error("populateBoardRandomly2", e);
            }
        }
    };


    /**
     * Populates the board with random digits
     *
     * @param targetBoard board to fill
     * @param sourceBoard full solution board
     * @param rowPermutation row permutation or null/undefined
     * @param colPermutation column permutation or null/undefined
     */
    //static void populatePermutatedBoard(final Board targetBoard, final Board sourceBoard, int[] rowPermutation, int[] colPermutation)
    ns.SudokuHelper.populatePermutatedBoard = function(targetBoard, sourceBoard, rowPermutation, colPermutation, cellFilter)
    {
        for (let sourceRow = 0; sourceRow < 9; sourceRow++)
        {
            for (let sourceCol = 0; sourceCol < 9; sourceCol++)
            {
                const targetRow = !rowPermutation ? sourceRow : rowPermutation[sourceRow];
                const targetCol = !colPermutation ? sourceRow : colPermutation[sourceCol];
                const sourceCell = sourceBoard.getCell(sourceRow,sourceCol);

                if (!cellFilter || cellFilter.test(sourceCell))
                {
                    try
                    {
                        const sourceDigit = sourceCell.getDigit();

                        targetBoard.getCell(targetRow,targetCol).changeToDigit(sourceDigit, ns.CellChange.Reason.INIT);
                    }
                    //catch (BoardSanityException e)
                    catch (e)
                    {
                        // There should not be exceptions if the source board is valid.
                        this.LOG.debug("populatePermutatedBoard", e);
                    }
                }
                else
                {
                    // skipping rejceted cell
                }
            }
        }
    };


    /**
     * Populates a target board to match a given source board.
     *
     * @param targetBoard target board
     * @param sourceBoard source board, by assumption a solved board.
     * @param n target number of solved cells to retain
     */
    //static void populateBoardFromSolution(final Board targetBoard, final Board solvedBoard, final int n)
    ns.SudokuHelper.populateBoardFromSolution = function(targetBoard, sourceBoard, n)
    {
        if (targetBoard.getKnownDigitsCount() > 0)
        {
            //todo board not empty
        }

        // To avoid cell index collisions, we use a list of indices and remove them one by one.
        //final List<Integer> cellChoices = new ArrayList<Integer>(81);
        const cellChoices = [];
        for (let i = 0; i < 81; i++) cellChoices.push(i);
        const random = ns.SudokuHelper.makeRamdom();

        for (let cellCount = 0; cellCount < n; cellCount++)
        {
            // Pick random cell index in 0..80 range
            const cellChoice = Math.floor(random() * cellChoices.length);
            const cellIndex = cellChoices.splice(cellChoice,1);
            const sourceCell = sourceBoard.getCell(cellIndex);
            const digit = sourceCell.getCellState().getDigit();

            try
            {
                const targetCell = targetBoard.getCell(cellIndex);
                targetCell.changeToDigit(digit, ns.CellChange.Reason.INIT);
            }
            //catch (BoardSanityException e)
            catch (e)
            {
                // There should not be exceptions if the solved board is valid.
                this.LOG.debug("populateBoardFromSolution", e);
            }
        }
    };


    /**
     * Makes a permutation of the indices usable for rows or columns.
     * The 3 groups of 3 consecutive rows can be permuted with each other, as can the 3 rows within the group.
     * There are 6 permutations of 3 elements, so there are 6**4 permutations of rows.
     *
     * @param seed randomization seed.
     * @return permutation expressed as and array of indirections.
     */
    //static int[]  makeRowPermutation(long seed)
    ns.SudokuHelper.makeRowPermutation = function(seed)
    {
        // Optional arg
        if (seed == null) seed = Date.now();

        let ret = new Array(9);

        // There are 6 permutations of 3 elements
        //final int[][] permutations3 = new int[][]{
        const permutations3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

        const random = ns.SudokuHelper.makeRamdom(seed);

        // Permutation of groups
        const p1 = permutations3[Math.floor(random() * 6)];
        for (let i = 0; i < 3; i++)
        {
            // Permutation in group
            const p2 = permutations3[Math.floor(random() * 6)];
            for (let j = 0; j < 3; j++)
            {
                ret[i * 3 + j] = p1[i] * 3 + p2[j];
            }
        }

        return ret;
    };


    /**
     * Makes a permutation of the given length.
     *
     * @param n length of permutation
     * @param seed randomization seed
     * @return permutation expressed as and array of indirections.
     */
    //static int[]  makePermutation(final int n, long seed)
    ns.SudokuHelper.makePermutation= function(n, seed)
    {
        let ret = new Array(n);

        const choices = new Array(n);
        for (let i = 0; i < n; i++) choices[i]=i;
        const random = ns.SudokuHelper.makeRamdom(seed);

        for (let i = 0; i < n; i++)
        {
            // Permutation in group
            ret[i] = choices.splice(Math.floor(random() * choices.length), 1);
        }

        return ret;
    };


    /**
     * Finds the permutation that maps the source array to the target array.
     *
     * @param source source board
     * @param target target board
     * @return Pair of permutations for rows and columns. Null means failure.
     */
    //static int[] findPermutation(final int[] source, final int[] target)
    ns.SudokuHelper.findPermutation = function(source, target)
    {
        if (source.length !== target.length || !this.validatePermutation(source) || !this.validatePermutation(target))
        {
            return null;
        }

        // Map each target value to its index in target
        const targetLocations = new Array(source.length);
        for (let i = 0; i < source.length; i++)
        {
            targetLocations[target[i]] = i;
        }

        // Map each index in source to its index in target
        const ret = new Array(source.length);
        for (let i = 0; i < source.length; i++)
        {
            ret[i] = targetLocations[source[i]];
        }
        return ret;
    };

    /**
     * Compare two solved board and tries to determine the row and column permutation that would transform the
     * source board into the target board.
     *
     * @param sourceBoard source board
     * @param targetBoard target board
     * @return Pair of permutations for rows and columns. Null means failure.
     */
    //static Pair<int[], int[]>  findPermutation(final Board sourceBoard, final Board targetBoard)
    ns.SudokuHelper.findBoardPermutation = function(sourceBoard, targetBoard)
    {
        // By assumption the boards are solved.
        // It might be possible to find permutation on partial boards but that is too hard for now.
        if (sourceBoard.getKnownDigitsCount() < 81 ||targetBoard.getKnownDigitsCount() < 81)
        {
            throw new IllegalArgumentException("THe boards must be complete.");
        }

        // Source and targets digits on first column
        const sourceColDigits = new Array(9);
        const targetColDigits = new Array(9);
        for (let i = 0; i < 9; i++)
        {
            sourceColDigits[i] = sourceBoard.getCell(i, 0).getDigit();
            targetColDigits[i] = targetBoard.getCell(i, 0).getDigit();
        }

        const pRows = this.findPermutation(sourceColDigits,targetColDigits);

        if (!this.validateRowPermutation(pRows))
        {
            return null;
        }

        // Source and targets digits on first row
        // We have to compare with the transformed one
        const sourceRowDigits = new Array(9);
        const targetRowDigits = new Array(9);
        for (let i = 0; i < 9; i++)
        {
            sourceRowDigits[i] = sourceBoard.getCell(0, i).getDigit();
            targetRowDigits[i] = targetBoard.getCell(pRows[0], i).getDigit();
        }

        const pCols = this.findPermutation(sourceRowDigits, targetRowDigits);

        // Validate group permutation by making sure each index appears once.
        if (!this.validateRowPermutation(pCols))
        {
            return null;
        }

        return [pRows,pCols];
    };

    /**
     * Tests that the permutation is valid.
     * Each source index must must mapped to a target index that is the same group of 3 columns.
     *
     * @param p permutation
     * @return true means valid
     */
    //static boolean validateRowPermutation(final int[] p)
    ns.SudokuHelper.validateRowPermutation = function(p)
    {
        if (p.length !== 9)
        {
//            throw new IllegalArgumentException("Size must be 9");
            return false;
        }

        let ret = this.validatePermutation(p);

        // Columns in a group must stay together in the target group
        for (let sourceGroupIndex = 0; sourceGroupIndex < 3 && ret; sourceGroupIndex++)
        {
            const targetGroupIndex0 = Math.floor(p[sourceGroupIndex * 3 + 0] / 3);
            const targetGroupIndex1 = Math.floor(p[sourceGroupIndex * 3 + 1] / 3);
            const targetGroupIndex2 = Math.floor(p[sourceGroupIndex * 3 + 2] / 3);

            ret = targetGroupIndex0 === targetGroupIndex1 && targetGroupIndex0 === targetGroupIndex2;
        }
        return ret;
    };

    /**
     * Tests that the permutation is valid.
     * Each index must appear once.
     *
     * @param p permutation
     * @return true means valid
     */
    //static boolean validatePermutation(final int[] p)
    ns.SudokuHelper.validatePermutation = function(p)
    {

//        // Expensive quadratic implementation
//        for (int i=0; i<9; i++)
//        {
//            int count = 0;
//            for (int j=0; j<9; j++)
//            {
//                if (p[j] === i) count++;
//            }
//            Assert.assertEquals(1, count);
//        }

        if (p.length > 32)
        {
            throw new lang.IllegalArgumentException("Permutation length limited to 32.");
        }

        let actual = 0;
        let expected = 0;
        for (let k in p)
        {
            expected = (expected << 1) | 0x1;
            actual |= 0x1 << p[k];
        }
        return actual === expected;
    };


    ns.SudokuHelper.prototype.LOG = ns.SudokuHelper.LOG = Logger.getLogger("SudokuHelper");

}(Module("sudoku"),Module("lang")));

console && console.log("### SudokuHelper.js end");

