console && console.log("### SolverStrategyCompositeTest.js begin");

//TODO add tests of applyOnce()

(function(ns,test,lang,tools)
{
    const LOG = Logger.getLogger("SolverStrategyCompositeTest");
    ns.solverStrategyCompositeTestSuite = new test.TestSuite({name: "SolverStrategyCompositeTest"});


    let printBoard = function(board, hits)
    {
        if (LOG._isDebugOn) {
            LOG.debug(hits + " hits");
            LOG.debug(ns.SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug(ns.SudokuHelper.printBoardDigitFlags(board));
        }
    };


//    public void test(final Board board) throws BoardSanityException
    let testBoard = function(board)
    {
        printBoard(board, 0);
        const solverStrategy = new ns.SolverStrategyComposite();
        const stopWatch = new tools.StopWatch().start();
        solverStrategy.apply(board);
        LOG.info("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    };


//    public void testBoardSolution(final Board board,final Board solutionBoard) throws BoardSanityException
    let testBoardSolution = function(board,solutionBoard)
    {
        board.setSolutionBoard(solutionBoard);
        testBoard(board);
    };


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_01", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01_SOLUTION));
    }));

    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_10", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
    }));

    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_20", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20_SOLUTION));
    }));

    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_30", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30_SOLUTION));
    }));

//    @Test(expected=BoardSanityException.class)
    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_40", active: true, expectedExceptionType: ns.BoardSanityException.TYPE}, function()
    {
        testBoard(ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X0", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X1", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X1),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X2", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X3", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X3),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X4", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X4),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION));
    }));


    ns.solverStrategyCompositeTestSuite.addTest(new test.TestCase({name: "test_X5", active: true, expectedExceptionType: null}, function()
    {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X5),
                ns.SudokuHelper.populateBoardFromText( new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION));
    }));

}(Module("sudoku"),Module("test"),Module("lang"),Module("tools")));

console && console.log("### SolverStrategyCompositeTest.js end");

