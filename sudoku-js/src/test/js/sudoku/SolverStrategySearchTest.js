console && console.log("### SolverStrategySearchTest.js begin");

(function(ns,test,lang,tools)
{
    //public class SolverStrategySearchTest

    let LOG = Logger.getLogger("SolverStrategySearchTest");
    ns.solverStrategySearchTestSuite = new test.TestSuite({name: "SolverStrategySearchTest"});


    //private void print(final Board board, int hits)
    let printBoard = function(board, hits)
    {
        if (LOG._isDebugOn) {
            LOG.debug(hits + " hits");
            LOG.debug(ns.SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug(ns.SudokuHelper.printBoardDigitFlags(board));
        }
    };


    //public void test(final Board board) throws BoardSanityException
    let testBoard = function(board)
    {
        printBoard(board, 0);
        const solverStrategy = new ns.SolverStrategySearch();

        const stopWatch = new tools.StopWatch().start();
        solverStrategy.apply(board);
        LOG.trace("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    };


    //public void test(final Board board,final Board solutionBoard) throws BoardSanityException
    let testBoardSolution = function(board,solutionBoard) {
        board.setSolutionBoard(solutionBoard);
        testBoard(board);
    };


    //public void test_01() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_01", active: true}, function() {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_01_SOLUTION));
        }));


    //public void test_10() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_10", active: true}, function() {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
        }));


    //public void test_20() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_20", active: true}, function() {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_20_SOLUTION));
        }));


    //public void test_30() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_30", active: true}, function() {
        testBoardSolution(
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30),
                ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_30_SOLUTION));
        }));


    //@Test(expected=BoardSanityException.class)
    //public void test_40() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_40", active: true, expectedExceptionType: ns.BoardSanityException.TYPE}, function()
    {
        testBoardSolution(ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
    }));


    //public void test_X0() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X0", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION));
    }));


    //public void test_X1() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X1", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X1),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION));
    }));


    //public void test_X2() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X2", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION));
    }));


    //public void test_X3() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X3", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X3),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION));
    }));

    //public void test_X4() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X4", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X4),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION));
    }));

    //public void test_X5() throws BoardSanityException
    ns.solverStrategySearchTestSuite.addTest(new test.TestCase({name: "test_X5", active: true}, function() {
        testBoardSolution(
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X5),
            ns.SudokuHelper.populateBoardFromText(new ns.Board(), ns.SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION));
    }));

}(Module("sudoku"),Module("test"),Module("lang"),Module("tools")));

console && console.log("### SolverStrategySearchTest.js end");

