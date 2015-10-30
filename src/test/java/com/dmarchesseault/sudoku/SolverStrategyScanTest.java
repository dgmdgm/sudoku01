package com.dmarchesseault.sudoku;

import com.dmarchesseault.tools.StopWatch;
import org.junit.Test;

public class SolverStrategyScanTest
{

//    @Test
    public void test_1() throws BoardSanityException
    {
        final SolverStrategyScan solver = new SolverStrategyScan();

        final Board board = new Board();
        SudokuHelper.populateBoardFromText(board, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

        print(board, 0);

        solver.apply(board);

        print(board, 0);
    }

//    @Test
    public void test_10() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
    }

//    @Test
    public void test_20() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_20),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_20_SOLUTION));
    }

    @Test
    public void test_30() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_30),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_30_SOLUTION));
    }

//    @Test
    public void test_40() throws BoardSanityException
    {
        test(SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
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
        test(board);
    }


    public void test(final Board board,final Board solutionBoard) throws BoardSanityException
    {
        board.setSolutionBoard(solutionBoard);
        test(board);
    }

    public void test(final Board board) throws BoardSanityException
    {
        print(board, 0);
        final SolverStrategy solverStrategy = new SolverStrategyScan();

        final StopWatch stopWatch = new StopWatch().start();
        int n;
        do {
            n = solverStrategy.apply(board);
            print(board, n);
        } while (n > 0);
        System.out.println("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    }

    private void print(final Board board, int hits)
    {
        System.out.println(hits + " hits");
        System.out.println(SudokuHelper.printBoardDigits(board, '.'));
        System.out.println(SudokuHelper.printBoardDigitFlags(board));
    }
}
