package com.dmarchesseault.sudoku;

import com.dmarchesseault.tools.StopWatch;
import org.apache.log4j.Logger;
import org.junit.Test;

public class SolverStrategyScanTest
{
    private static final Logger LOG = Logger.getLogger(SolverStrategyScanTest.class);

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
        final SolverStrategy solverStrategy = new SolverStrategyScan();

        final StopWatch stopWatch = new StopWatch().start();
        int n;
        do {
            n = solverStrategy.apply(board);
            printBoard(board, n);
        } while (n > 0);
        LOG.debug("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    }

    public void testBoardSolution(final Board board, final Board solutionBoard) throws BoardSanityException
    {
        board.setSolutionBoard(solutionBoard);
        testBoard(board);
    }

    //    @Test
    public void test_1() throws BoardSanityException
    {
        final SolverStrategyScan solver = new SolverStrategyScan();

        final Board board = new Board();
        SudokuHelper.populateBoardFromText(board, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

        printBoard(board, 0);

        solver.apply(board);

        printBoard(board, 0);
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
    public void test_scanIdenticalFlagsInGroups() throws BoardSanityException
    {
        // This board is designed to have 3 cells on the first row that have candidate flags for digits 7 and 8
        // The pair of clles that have only those two flags should be detected and the flags should be reset in the other
        // cell i the last column
        final String BOARD =
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

        final Board board = new Board();
        SudokuHelper.populateBoardFromText(board, BOARD);
        testBoard(board);
    }

}
