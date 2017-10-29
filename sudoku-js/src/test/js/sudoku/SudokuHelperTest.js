console && console.log("### ns.SudokuHelperTest.js begin");

(function(ns,test,tools)
{
    let LOG = Logger.getLogger("SudokuHelperTest");

    ns.sudokuHelperTestSuite = new test.TestSuite({name: "SudokuHelperTest"});

    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_", active: true, expectedExceptionType: null}, function() {
    }));

    const contentEmpty =
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            ".........";

    const contentDiagonal =
            "1........" +
            ".2......." +
            "..3......" +
            "...4....." +
            "....5...." +
            ".....6..." +
            "......7.." +
            ".......8." +
            "........9";

    /** Tests that by applying the given permutations to the source we obtain the target board. */
    //void testBoardPermutation(const source, const target, constpRow, constpCol) throws SanityException
    let testBoardPermutation = function(source, target, pRow, pCol)
    {
        const target2 = new ns.Board();
        ns.SudokuHelper.populatePermutatedBoard(target2, source, pRow, pCol, null);
        target2.setSolutionBoard(target);
        target2.checkSanity();
    };


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_constructor", active: true, expectedExceptionType: null}, function() {
        const board = new ns.Board();

        test.Assert.assertNotNull(board);
        //todo
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_makeDigitsFromString_empty", active: true, expectedExceptionType: null}, function() {
        const digits = ns.SudokuHelper.makeDigitsFromString(contentEmpty);

        for (let i = 0; i < 9*9; i++)
        {
            const expected = -1;
            test.Assert.assertEquals("("+i+")", expected, digits[i] );
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_makeDigitsFromString_diagonal", active: true, expectedExceptionType: null}, function() {
        const digits = ns.SudokuHelper.makeDigitsFromString(contentDiagonal);

        for (let i = 0; i < 9 * 9; i++)
        {
            const row = Math.floor(i / 9);
            const col = i % 9;

            const expected = row === col ? row : -1;
            test.Assert.assertEquals("(" + i + ")", expected, digits[i]);
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_populateBoardFromText_empty", active: true, expectedExceptionType: null}, function() {
        const board = new ns.Board();
        ns.SudokuHelper.populateBoardFromText(board, contentEmpty);

        for (let i = 0; i < 9*9; i++){
            const cellState = board.getCell(i).getCellState();
            const expected = ns.CellState.INIT_STATE;
            test.Assert.assertEquals("("+i+")", expected, cellState);
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_populateBoardFromText_diagonal", active: true, expectedExceptionType: null}, function() {
        const board = new ns.Board();
        ns.SudokuHelper.populateBoardFromText(board, contentDiagonal);

        for (let row = 0; row < 9; row++)
        {
            for (let col = 0; col < 9; col++)
            {
                const cellState = board.getCell(row, col).getCellState();
                const expected = row === col ? ns.CellState.KNOWN_DIGIT_STATE[row] : ns.CellState.INIT_STATE;
                test.Assert.assertEquals("(" + row + "," + col + ")", expected, cellState);
            }
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_printBoardValues", active: true, expectedExceptionType: null}, function() {
        const rowSize = 3*8 + 2;
        const expectedBoardPrintSize = (3*4 + 1) * rowSize;

        {
            const board = new ns.Board();

            const s = ns.SudokuHelper.printBoardDigits(board, '.', false);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
            test.Assert.assertTrue(s.includes("+-------+-------+-------+"));
        }
        {
            const board = new ns.Board();

            const s = ns.SudokuHelper.printBoardDigits(board, '_', false);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
            test.Assert.assertTrue(s.includes("+-------+-------+-------+"));
        }
        {
            const board = new ns.Board();
            ns.SudokuHelper.populateBoardFromText(board, ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            const s = ns.SudokuHelper.printBoardDigits(board, '0', false);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
            test.Assert.assertTrue(s.includes("+-------+-------+-------+"));
        }
        {
            const board = new ns.Board();
            ns.SudokuHelper.populateBoardFromText(board, ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            const s = ns.SudokuHelper.printBoardDigits(board, ' ', false);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
            test.Assert.assertTrue(s.includes("+-------+-------+-------+"));
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_printBoardValueFlags", active: true, expectedExceptionType: null}, function() {
        const expectedBoardPrintSize = (1 + 3*4) * (1 + 3*(3*10 + 2) + 1);

        {
            const board = new ns.Board();

            const s = ns.SudokuHelper.printBoardDigitFlags(board);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
        }
        {
            const board = new ns.Board();
            ns.SudokuHelper.populateBoardFromText(board, ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            const s = ns.SudokuHelper.printBoardDigitFlags(board);
            test.Assert.assertEquals(expectedBoardPrintSize, s.length);
        }

    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_populateBoardRandomly2", active: true, expectedExceptionType: null}, function() {
        const nums = [9,18,27,36,45,54,63,72, 81];
        for (let k in nums)
        {
            const n = nums[k];
            const board = new ns.Board();

            const stopWatch = (new tools.StopWatch()).start();
            ns.SudokuHelper.populateBoardRandomly2(board, n);
            board.checkSanity();
            if (LOG._isDebugOn) {
                LOG.debug("Test elapsed time: " + stopWatch.stop().elapsed());
                LOG.debug("Board: \n" + ns.SudokuHelper.printBoardDigits(board));
            }

            test.Assert.assertEquals(n, board.getKnownDigitsCount());
        }
    }));

    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_populateBoardFromSolution", active: true, expectedExceptionType: null}, function() {
        const sourceBoard = ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION);

        const nums = [9,18,27,36,45,54,63,72, 81];
        for (let k in nums)
        {
            const n = nums[k];
            const board = new ns.Board();

            const stopWatch = (new tools.StopWatch()).start();
            ns.SudokuHelper.populateBoardFromSolution(board, sourceBoard, n);
            LOG.debug("Test elapsed time: " + stopWatch.stop().elapsed());
            if (LOG._isTraceOn) LOG.trace("Board: \n" + ns.SudokuHelper.printBoardDigits(board));

            test.Assert.assertEquals(n, board.getKnownDigitsCount());
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_populatePermutatedBoard", active: true, expectedExceptionType: null}, function() {
        const sourceBoard = ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION);
        if (LOG._isTraceOn) LOG.trace("Board: \n" + ns.SudokuHelper.printBoardDigits(sourceBoard));

        {
            const targetBoard = new ns.Board();
            const pRow = ns.SudokuHelper.makeRowPermutation(0);
            const pCol = ns.SudokuHelper.makeRowPermutation(1);
            if (LOG._isTraceOn) LOG.trace("pRow: " + pRow);
            if (LOG._isTraceOn) LOG.trace("pCol: " + pCol);

            ns.SudokuHelper.populatePermutatedBoard(targetBoard, sourceBoard, pRow, pCol, null);
            if (LOG._isTraceOn) LOG.trace("Board: \n" + ns.SudokuHelper.printBoardDigits(targetBoard));

            for (let row = 0; row < 9; row++)
            {
                for (let col = 0; col < 9; col++)
                {
                    test.Assert.assertEquals("("+row+","+col+")", sourceBoard.getCell(row,col).getDigit(),
                            targetBoard.getCell(pRow[row],pCol[col]).getDigit());
                }
            }
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_findPermutation_array", active: true, expectedExceptionType: null}, function() {
        const trios = [
                [0, 1, 2], [0, 1, 2], [0, 1, 2],
                [0, 1, 2], [0, 2, 1], [0, 2, 1],
                [0, 2, 1], [1, 2, 0], [2, 1, 0],
                [1, 0, 2], [2, 1, 0], [1, 2, 0],
                [1, 0, 2, 4, 3], [4, 0, 3, 1, 2], [3, 1, 4, 0, 2],
                [0, 1], [0, 1, 2], null,
                [0, 1, 1], [1, 2], null,
                [0, 1, 1], [0, 1, 2], null
        ];

        // compare arrays
        const arrayEquals = function(a1,a2) {
            if (a1.length !== a2.length) return false;
            for (let k in a1) if (a1[k] !== a2[k]) return false;
            return true;
        };

        for (let i = 0, len = Math.floor(trios.length / 3); i < len; i += 3)
        {
            const source = trios[i];
            const target = trios[i+1];
            const expected = trios[i+2];
            //Assert.assertTrue("s="+Arrays.toString(source)+", t="+Arrays.toString(target)+", p="+Arrays.toString(expected),
            //        Arrays.equals(expected, ns.SudokuHelper.findPermutation(source,target)));
            test.Assert.assertTrue("s="+source+", t="+target+", p="+expected,
                arrayEquals(expected, ns.SudokuHelper.findPermutation(source,target)));
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_findBoardPermutation_Board", active: true, expectedExceptionType: null}, function() {
        const source = ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION);
        const target = ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2P_SOLUTION);

        const pair = ns.SudokuHelper.findBoardPermutation(source, target);
        const pRow = pair[0];
        const pCol = pair[1];

        //todo Would be nice to apply transform to board and compare results.
//        test.Assert.fail("Test implementation incomplete");

        testBoardPermutation(source, target, pRow, pCol);
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_findBoardPermutation_our_boards", active: true, expectedExceptionType: null}, function() {
        // for fun, see if we can find transforms between our known boards
        const boards = [
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2P_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION)
        ];

        for (let i = 0; i < boards.length; i++)
        {
            for (let j = i+1; j < boards.length; j++)
            {
                const source = boards[i];
                const target = boards[j];

                if (LOG._isTraceOn) LOG.trace("i=" + i + ", j=" + j);
                const pair = ns.SudokuHelper.findBoardPermutation(source, target);
                if (LOG._isTraceOn) LOG.trace("permutation pair=" + pair);
                if (pair != null)
                {
                    const pRow = pair[0];
                    const pCol = pair[1];
                    if (LOG._isTraceOn) LOG.trace("pRow=" + pRow);
                    if (LOG._isTraceOn) LOG.trace("pCol=" + pCol);
                    testBoardPermutation(source, target, pRow, pCol);
                }
                else
                {
                    //todo log warning
                    //Assert.fail("Should (i hope) have found a permutation");
                }
            }
        }
    }));


    //todo
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_findPermutation_new_boards", active: false, expectedExceptionType: null}, function() {
        // For fun, see if we can find transforms between our known boards

        const solver = new ns.SolverStrategyComposite();

        // Generate n boards
        const boards = new Array(Math.floor(9*8/2));
        let boardCount = 0;
        for (let i = 0; i < 9; i++)
        {
            for (let j = i+1; j < 9; j++)
            {
                const board = new ns.Board();
                board.getCell(0).changeToDigit(i, ns.CellChange.Reason.INIT);
                board.getCell(1).changeToDigit(j, ns.CellChange.Reason.INIT);
                solver.apply(board);
                boards[boardCount++] = board;
            }
        }


        //final Map<Integer, List<Integer>> groupsMap = new HashMap<Integer, List<Integer>>();
        const groupsMap = {};

        for (let i = 0, ilen = boards.length; i < ilen; i++)
        {
            const source = boards[i];

            //List<Integer> groupA = groupsMap.get(i);
            let groupA = groupsMap[i];
            if (!groupA)
            {
                groupA = [];
                groupA.push(i);
                groupsMap[i] = groupA;
            }

            for (let j = i+1, jlen = boards.length; j < jlen; j++)
            {
                const target = boards[j];

                if (LOG._isTraceOn) {
                    LOG.trace("i=" + i + ", j=" + j);
                    LOG.trace("boards["+i+","+j+"]=\n" + ns.SudokuHelper.printBoardDigits(source) + "\n" + ns.SudokuHelper.printBoardDigits(target) + "\n" );
                }

                const pair = ns.SudokuHelper.findBoardPermutation(source, target);
                if (LOG._isTraceOn) LOG.trace("permutation pair=" + pair);
                if (pair != null)
                {
                    const pRow = pair[0];
                    const pCol = pair[1];
                    if (LOG._isTraceOn) LOG.trace("pRow=" + pRow);
                    if (LOG._isTraceOn) LOG.trace("pCol=" + pCol);

                    // Put board j in the same group as board i
                    groupA.push(j);
                    groupsMap[j] = groupA;
                }
            }
        }

        //final Set<List<Integer>> groupsSet = new HashSet<List<Integer>>();
        //groupsSet.addAll(groupsMap.values());
        //
        //int groupCount = 0;
        //for (List<Integer> group : groupsSet)
        //{
        //    if (LOG._isTraceOn) LOG.trace("group[" + groupCount++ + "]=" + group);
        //}

        //todo
        //Cannot always find permutation
        // Speculating that there may be a partition of the universal set of board
        // We should try multiple boards to see if we can determine a small partition.

        test.Assert.fail("Test implementation incomplete");
    }));


    //todo @Test
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_makeRowPermutation_1", active: true, expectedExceptionType: null}, function() {
        const perm = ns.SudokuHelper.makeRowPermutation();

        test.Assert.assertEquals("should be the same size as board", 9, perm.length);

        // Once sorted, we can check that each index appears exactly once.
        perm.sort();
        for (let i = 0; i < 9; i++)
        {
            test.Assert.assertEquals(i, perm[i]);
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_makeRowPermutation_2", active: true, expectedExceptionType: null}, function() {
        // It is possible that the permutation will be the identity one. There is a chance in 9!.
        // A testBoard that check that the permutation is never identity could eventually fail.
        // A less risky testBoard is to check that 3 consecutive permutations are not equal.

        // Create n permutations
        const n = 3;
        //final int[][] perms = new int[n][];
        const perms = new Array(n);
        for (let i = 0; i < n; i++) {
            // We have to make sure to get enough randomness by avoiding twice the same seed.
            const perm = ns.SudokuHelper.makeRowPermutation(Date.now()+i);
            test.Assert.assertEquals("should be the same size as board", 9, perm.length);
            perms[i] = perm;
        }

        // Compare permutation pairwise and count differences between their content.
        let diffCount = 0;
        for (let i = 0; i < n; i++) {
            const permA = perms[i];
            for (let j = i + 1; j < n; j++) {
                const permB = perms[j];
                for (let k = 0; k < 9; k++) {
                    if (permA[k] === permB[k]) diffCount++;
                }
            }
            if (LOG._isTraceOn) LOG.trace("diffCount=" + diffCount);
            test.Assert.assertTrue("There should be a least some difference", diffCount > 0);
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_makePermutation", active: true, expectedExceptionType: null}, function() {
        const random = ns.SudokuHelper.makeRamdom();
        for (let i = 0; i < 100; i++)
        {
            const p = ns.SudokuHelper.makePermutation(9, Math.floor(random()*Number.MAX_SAFE_INTEGER));
            //if (LOG._isTraceOn) LOG.trace("p=" + Arrays.toString(p));
            test.Assert.assertTrue(ns.SudokuHelper.validatePermutation(p));
        }
    }));

    
    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_validatePermutation", active: true, expectedExceptionType: null}, function() {
        const good = [
                   [0,1,2],
                   [0,2,1],
                   [1,0,2],
                   [1,2,0],
                   [2,0,1],
                   [2,1,0]
           ];
        const bad = [
                   [0,1,1],
                   [2,2,1],
                   [1,3,2],
                   [1,2,-1]
           ];

        for (let k1 in good)
        {
            const aGood = good[k1];
            test.Assert.assertEquals(true, ns.SudokuHelper.validatePermutation(aGood));
        }
        for (let k2 in bad)
        {
            const aBad = bad[k2];
            test.Assert.assertEquals(false, ns.SudokuHelper.validatePermutation(aBad));
        }
    }));


    ns.sudokuHelperTestSuite.addTest(new test.TestCase({name: "test_validateRowPermutation", active: true, expectedExceptionType: null}, function() {
        const good = [
                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                [8, 7, 6, 5, 4, 3, 2, 1, 0],
                [0, 1, 2, 6, 7, 8, 3, 4, 5],
                [3, 4, 5, 0, 1, 2, 6, 7, 8],
                [3, 4, 5, 6, 7, 8, 0, 1, 2],
                [0, 2, 1, 5, 4, 3, 7, 6, 8],
                [8, 6, 7, 4, 5, 3, 0, 1, 2]
        ];
        const bad = [
                [0, 1, 2, 3, 4, 5, 6, 7],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [3, 1, 2, 0, 4, 5, 6, 7, 8],
                [0, 1, 2, 3, 4, 8, 6, 7, 5],
                [0, 7, 2, 3, 4, 5, 6, 1, 8]
           ];

        for (let k1 in good)
        {
            const aGood= good[k1];
            test.Assert.assertTrue(ns.SudokuHelper.validateRowPermutation(aGood));
        }
        for (let k2 in bad)
        {
            const aBad = bad[k2];
            test.Assert.assertFalse(ns.SudokuHelper.validateRowPermutation(aBad));
        }
    }));

}(Module("sudoku"),Module("test"),Module("tools")));

console && console.log("### ns.SudokuHelperTest.js end");
