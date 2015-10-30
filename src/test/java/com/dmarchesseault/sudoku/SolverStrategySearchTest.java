package com.dmarchesseault.sudoku;

import com.dmarchesseault.tools.StopWatch;
import org.junit.Test;

//todo impl with asserts
public class SolverStrategySearchTest
{

    @Test
    public void test_01() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_01),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_01_SOLUTION));
    }

    @Test
    public void test_10() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_10_SOLUTION));
    }

    @Test
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

    @Test(expected=BoardSanityException.class)
    public void test_40() throws BoardSanityException
    {
        test(SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_40));
    }

    public void test(final Board board,final Board solutionBoard) throws BoardSanityException
    {
        board.setSolutionBoard(solutionBoard);
        test(board);
    }


    @Test
    public void test_X0() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION));
    }


    @Test
    public void test_X1() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X1),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION));
    }

    @Test
    public void test_X2() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION));
    }

    @Test
    public void test_X3() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X3),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION));
    }

    @Test
    public void test_X4() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X4),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION));
    }

    @Test
    public void test_X5() throws BoardSanityException
    {
        test(
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X5),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION));
    }


    public void test(final Board board) throws BoardSanityException
    {
        print(board, 0);
        final SolverStrategy solverStrategy = new SolverStrategySearch();

        final StopWatch stopWatch = new StopWatch().start();
        solverStrategy.apply(board);
        System.out.println("Solver elapsed time (ms): " + stopWatch.stop().elapsed());
    }

    private void print(final Board board, int hits)
    {
        System.out.println(hits + " hits");
        System.out.println(SudokuHelper.printBoardDigits(board, '.'));
        System.out.println(SudokuHelper.printBoardDigitFlags(board));
    }
}
