package com.dmarchesseault.sudoku;

import com.dmarchesseault.tools.StopWatch;
import org.apache.log4j.Logger;
import org.junit.Test;

//TODO add tests of applyOnce()

//todo impl with asserts
public class SolverStrategyCompositeTest
{
    private static final Logger LOG = Logger.getLogger(SolverStrategyCompositeTest.class);

    private void printBoard(final Board board, int hits)
    {
        if(LOG.isDebugEnabled())
        {
            LOG.debug(hits + " hits");
            LOG.debug(SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug(SudokuHelper.printBoardDigitFlags(board));
        }
    }

    public void testBoard(final Board board) throws BoardSanityException
    {
        printBoard(board, 0);
        final SolverStrategy solverStrategy = new SolverStrategyComposite();

        final StopWatch stopWatch = new StopWatch().start();
        solverStrategy.apply(board);
        if(LOG.isDebugEnabled()) LOG.debug("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    }


    public void testBoardSolution(final Board board, final Board solutionBoard) throws BoardSanityException
    {
        board.setSolutionBoard(solutionBoard);
        testBoard(board);
    }

    @Test
    public void test_01() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_01),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_01_SOLUTION));
    }

    @Test
    public void test_10() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
    }

    @Test
    public void test_20() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_20),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_20_SOLUTION));
    }

    @Test
    public void test_30() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_30),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_30_SOLUTION));
    }

    @Test(expected=BoardSanityException.class)
    public void test_40() throws BoardSanityException
    {
        testBoard(SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
    }

    @Test
    public void test_X0() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION));
    }

    @Test
    public void test_X1() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X1),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION));
    }

    @Test
    public void test_X2() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION));
    }

    @Test
    public void test_X3() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X3),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION));
    }

    @Test
    public void test_X4() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X4),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION));
    }

    @Test
    public void test_X5() throws BoardSanityException
    {
        testBoardSolution(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X5),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION));
    }

}
