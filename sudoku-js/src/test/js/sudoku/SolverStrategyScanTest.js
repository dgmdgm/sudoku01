console && console.log("### ns.SolverStrategyScanTest.js begin");

(function(ns,test,lang,tools)
{

    LOG = Logger.getLogger("SolverStrategyScanTest");
    ns.solverStrategyScanTestSuite = new test.TestSuite({name: "SolverStrategyScanTest"});

    let printBoard = function(board, hits)
    {
        if (LOG._isDebugOn) {
            LOG.debug(hits + " hits");
            LOG.debug(ns.SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug(ns.SudokuHelper.printBoardDigitFlags(board));
        }
    };


    let testBoard = function (board)
    {
        const solverStrategy = new ns.SolverStrategyScan();
        printBoard(board, 0);

        const stopWatch = new tools.StopWatch().start();
        let n;
        do {
            n = solverStrategy.apply(board);
            printBoard(board, n);
        } while (n > 0);
        LOG.trace("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    };


    let testBoardSolution = function (board, solutionBoard)
    {
        board.setSolutionBoard(solutionBoard);
        testBoard(board);
    };


    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_1", active: true}, function() {
        const solver = new ns.SolverStrategyScan();

            const board = new ns.Board();
            ns.SudokuHelper.populateBoardFromText(board, ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            printBoard(board, 0);

            solver.apply(board);

            printBoard(board, 0);
        }));


    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_10", active: true},function() {
            testBoardSolution(
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
        }));


    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_20", active: true}, function() {
        testBoardSolution(
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20),
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20_SOLUTION));
        }));


    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_30", active: true}, function() {
        testBoardSolution(
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30),
                    ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30_SOLUTION));
        }));


    //@Test(expected=BoardSanityException.class)
    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_40", expectedExceptionType: ns.BoardSanityException.TYPE, active: true}, function() {
        testBoard(ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
        }));


    ns.solverStrategyScanTestSuite.addTest(new test.TestCase({name: "test_scanIdenticalFlagsInGroups", active: true}, function() {
            // This board is designed to have 3 cells on the first row that have candidate flags for digits 7 and 8
            // The pair of clles that have only those two flags should be detected and the flags should be reset in the other
            // cell i the last column
            const BOARD =
                    "+-----+-----+-----+" +
                    "|1 2 3|4 5 .|. . .|" +
                    "|. . .|. . 7|. . .|" +
                    "|. . .|. . 8|. . .|" +
                    "+-----+-----+-----+" +
                    "|. . .|. . .|6 . .|" +
                    "|. . .|. . .|9 . .|" +
                    "|. . .|. . .|. . .|" +
                    "+-----+-----+-----+" +
                    "|. . .|. . .|. 6 .|" +
                    "|. . .|. . .|. 9 .|" +
                    "|. . .|. . .|. . .|" +
                    "+-----+-----+-----+";

            const board = new ns.Board();
            ns.SudokuHelper.populateBoardFromText(board, BOARD);
            testBoard(board);
        }));

}(Module("sudoku"),Module("test"),Module("lang"),Module("tools")));

console && console.log("### ns.SolverStrategyScanTest.js end");
