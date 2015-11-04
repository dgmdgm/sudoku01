package com.dmarchesseault.sudoku;

import com.dmarchesseault.tools.StopWatch;
import javafx.util.Pair;
import junit.framework.Assert;
import org.junit.Test;

import java.util.*;

public class SudokuHelperTest
{
    static final String contentEmpty =
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            "........." +
            ".........";

    static final String contentDiagonal =
            "1........" +
            ".2......." +
            "..3......" +
            "...4....." +
            "....5...." +
            ".....6..." +
            "......7.." +
            ".......8." +
            "........9";

    @Test
    public void test_constructor()
    {
        final Board board = new Board();

        Assert.assertNotNull(board);
        //todo
    }


    @Test
    public void test_makeDigitsFromString_empty()
    {
        final int[] digits = SudokuHelper.makeDigitsFromString(contentEmpty);

        for (int i = 0; i < 9*9; i++)
        {
            final int expected = -1;
            Assert.assertEquals("("+i+")", expected, digits[i] );
        }
    }

    @Test
    public void test_makeDigitsFromString_diagonal()
    {
        final int[] digits = SudokuHelper.makeDigitsFromString(contentDiagonal);

        for (int i = 0; i < 9 * 9; i++)
        {
            final int row = i / 9;
            final int col = i % 9;

            final int expected = row == col ? row : -1;
            Assert.assertEquals("(" + i + ")", expected, digits[i]);
        }
    }


    @Test
    public void test_populateBoardFromText_empty() throws BoardSanityException
    {
        final Board board = new Board();
        SudokuHelper.populateBoardFromText(board, contentEmpty);

        for (int i = 0; i < 9*9; i++){
            final CellState cellState = board.getCell(i).getCellState();
            final CellState expected = CellState.INIT_STATE;
            Assert.assertEquals("("+i+")", expected, cellState);
        }
    }

    @Test
    public void test_populateBoardFromText_diagonal() throws BoardSanityException
    {
        final Board board = new Board();
        SudokuHelper.populateBoardFromText(board, contentDiagonal);

        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                final CellState cellState = board.getCell(row, col).getCellState();
                final CellState expected = row == col ? CellState.KNOWN_DIGIT_STATE[row] : CellState.INIT_STATE;
                Assert.assertEquals("(" + row + "," + col + ")", expected, cellState);
            }
        }
    }

    @Test
    public void test_printBoardValues() throws BoardSanityException
    {
        final int rowSize = 3*8 + 2;
        final int expectedBoardPrintSize = (3*4 + 1) * rowSize;

        {
            final Board board = new Board();

            final String s = SudokuHelper.printBoardDigits(board, '.', false);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
            Assert.assertTrue(s.contains("+-------+-------+-------+"));
        }
        {
            final Board board = new Board();

            final String s = SudokuHelper.printBoardDigits(board, '_', false);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
            Assert.assertTrue(s.contains("+-------+-------+-------+"));
        }
        {
            final Board board = new Board();
            SudokuHelper.populateBoardFromText(board, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            final String s = SudokuHelper.printBoardDigits(board, '0', false);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
            Assert.assertTrue(s.contains("+-------+-------+-------+"));
        }
        {
            final Board board = new Board();
            SudokuHelper.populateBoardFromText(board, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            final String s = SudokuHelper.printBoardDigits(board, ' ', false);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
            Assert.assertTrue(s.contains("+-------+-------+-------+"));
        }
    }


    @Test
    public void test_printBoardValueFlags() throws BoardSanityException
    {
        final int expectedBoardPrintSize = (1 + 3*4) * (1 + 3*(3*10 + 2) + 1);

        {
            final Board board = new Board();

            final String s = SudokuHelper.printBoardDigitFlags(board);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
        }
        {
            final Board board = new Board();
            SudokuHelper.populateBoardFromText(board, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

            final String s = SudokuHelper.printBoardDigitFlags(board);
            Assert.assertEquals(expectedBoardPrintSize, s.length());
        }

    }

    @Test
    public void test_populateBoardRandomly() throws BoardSanityException
    {
        for (int n : new int[]{9,18,27,36,45,54,63,72})
        {
            final Board board = new Board();

            final StopWatch stopWatch = (new StopWatch()).start();
            SudokuHelper.populateBoardRandomly(board, n);
            System.out.println("Test elapsed time: " + stopWatch.stop().elapsed());
            System.out.println("Board: \n" + SudokuHelper.printBoardDigits(board));

            Assert.assertEquals(n, board.getKnownDigitsCount());
        }
    }

    @Test
    public void test_populateBoardFromSolution() throws BoardSanityException
    {
        final Board sourceBoard = SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION);

        for (int n : new int[]{9,18,27,36,45,54,63,72,81})
        {
            final Board board = new Board();

            final StopWatch stopWatch = (new StopWatch()).start();
            SudokuHelper.populateBoardFromSolution(board, sourceBoard, n);
            System.out.println("Test elapsed time: " + stopWatch.stop().elapsed());
            System.out.println("Board: \n" + SudokuHelper.printBoardDigits(board));

            Assert.assertEquals(n, board.getKnownDigitsCount());
        }
    }


    @Test
    public void test_populatePermutatedBoard() throws BoardSanityException
    {
        final Board sourceBoard = SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION);
        verbose("Board: \n" + SudokuHelper.printBoardDigits(sourceBoard));

        {
            final Board targetBoard = new Board();
            final int[] pRow = SudokuHelper.makeRowPermutation(0);
            final int[] pCol = SudokuHelper.makeRowPermutation(1);
            verbose("pRow: " + Arrays.toString(pRow));
            verbose("pCol: " + Arrays.toString(pCol));

            SudokuHelper.populatePermutatedBoard(targetBoard, sourceBoard, pRow, pCol);
            verbose("Board: \n" + SudokuHelper.printBoardDigits(targetBoard));

            for (int row = 0; row < 9; row++)
            {
                for (int col = 0; col < 9; col++)
                {
                    Assert.assertEquals("("+row+","+col+")", sourceBoard.getCell(row,col).getDigit(),
                            targetBoard.getCell(pRow[row],pCol[col]).getDigit());
                }
            }
        }
    }

    @Test
    public void test_findPermutation_array()
    {
        final int[][] trios = new int[][]{
                {0, 1, 2}, {0, 1, 2}, {0, 1, 2},
                {0, 1, 2}, {0, 2, 1}, {0, 2, 1},
                {0, 2, 1}, {1, 2, 0}, {2, 1, 0},
                {1, 0, 2}, {2, 1, 0}, {1, 2, 0},
                {1, 0, 2, 4, 3}, {4, 0, 3, 1, 2}, {3, 1, 4, 0, 2},
                {0, 1}, {0, 1, 2}, null,
                {0, 1, 1}, {1, 2}, null,
                {0, 1, 1}, {0, 1, 2}, null,
        };

        for (int i = 0; i < trios.length / 3; i += 3)
        {
            final int[] source = trios[i];
            final int[] target = trios[i+1];
            final int[] expected = trios[i+2];
            Assert.assertTrue("s="+Arrays.toString(source)+", t="+Arrays.toString(target)+", p="+Arrays.toString(expected),
                    Arrays.equals(expected, SudokuHelper.findPermutation(source,target)));
        }
    }

    @Test
    public void test_findPermutation_Board() throws BoardSanityException
    {
        final Board source = SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION);
        final Board target = SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2P_SOLUTION);

        final Pair<int[], int[]> pair = SudokuHelper.findPermutation(source, target);
        final int[] pRow = pair.getKey();
        final int[] pCol = pair.getValue();

        //todo apply transform to board and compare results
        Assert.fail("TEST NOT IMPLEMENTED");

//            Assert.assertTrue("s=" + Arrays.toString(source) + ", t=" + Arrays.toString(target) + ", p=" + Arrays.toString(expected),
//                    Arrays.equals(expected, SudokuHelper.findPermutation(source, target)));
    }

    @Test
    public void test_findPermutation_our_boards() throws BoardSanityException
    {
        // for fun, see if we can find transforms between our known boards
        final Board[] boards = new Board[]{
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X0_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X1_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X2P_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X3_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X4_SOLUTION),
                SudokuHelper.populateBoardFromText(new Board(), SudokuSamples.SUDOKU_BOARD_SAMPLE_X5_SOLUTION),
        };

        for (int i = 0; i < boards.length; i++)
        {
            for (int j = i+1; j < boards.length; j++)
            {
                final Board source = boards[i];
                final Board target = boards[j];

                verbose("i=" + i + ", j=" + j);
                final Pair<int[], int[]> pair = SudokuHelper.findPermutation(source, target);
                verbose("permutation pair=" + pair);
                if (pair != null)
                {
                    final int[] pRow = pair.getKey();
                    final int[] pCol = pair.getValue();
                    verbose("pRow=" + Arrays.toString(pRow) );
                    verbose("pCol=" + Arrays.toString(pCol) );
                }
            }
        }

        Assert.fail("TEST NOT IMPLEMENTED");
    }

    @Test
    public void test_findPermutation_new_boards() throws BoardSanityException
    {
        // For fun, see if we can find transforms between our known boards

        final SolverStrategyComposite solver = new SolverStrategyComposite();

        // Generate n boards
        final Board[] boards = new Board[9*8/2];
        int boardCount = 0;
        for (int i = 0; i < 9; i++)
        {
            for (int j = i+1; j < 9; j++)
            {
                final Board board = new Board();
                board.getCell(0).changeToDigit(i, CellChange.Reason.INIT);
                board.getCell(1).changeToDigit(j, CellChange.Reason.INIT);
                solver.apply(board);
                boards[boardCount++] = board;
            }
        }


        final Map<Integer, List<Integer>> groupsMap = new HashMap<Integer, List<Integer>>();

        for (int i = 0; i < boards.length; i++)
        {
            final Board source = boards[i];

            List<Integer> groupA = groupsMap.get(i);
            if (groupA == null)
            {
                groupA = new ArrayList<Integer>();
                groupA.add(i);
                groupsMap.put(i, groupA);
            }

            for (int j = i+1; j < boards.length; j++)
            {
                final Board target = boards[j];

                verbose("i=" + i + ", j=" + j);
                verbose("boards["+i+","+j+"]=\n" + SudokuHelper.printBoardDigits(source) + "\n" + SudokuHelper.printBoardDigits(target) + "\n" );

                final Pair<int[], int[]> pair = SudokuHelper.findPermutation(source, target);
                verbose("permutation pair=" + pair);
                if (pair != null)
                {
                    final int[] pRow = pair.getKey();
                    final int[] pCol = pair.getValue();
                    verbose("pRow=" + Arrays.toString(pRow) );
                    verbose("pCol=" + Arrays.toString(pCol) );

                    // Put board j in the same group as board i
                    groupA.add(j);
                    groupsMap.put(j, groupA);
                }
            }
        }

        final Set<List<Integer>> groupsSet = new HashSet<List<Integer>>();
        groupsSet.addAll(groupsMap.values());

        int groupCount = 0;
        for (List<Integer> group : groupsSet)
        {
            verbose("group[" + groupCount++ + "]=" + group);
        }

        //todo
        //Cannot always find permutation
        // Speculating that there may be a partition of the universal set of board
        // We should try multiple boards to see if we can determine a small partition.

        Assert.fail("TEST NOT IMPLEMENTED");
    }


    @Test
    public void test_makeRowPermutation_1()
    {
        final int[] perm = SudokuHelper.makeRowPermutation();

        Assert.assertEquals("should be the same size as board", 9, perm.length);

        // Once sorted, we can check that each index appears exactly once.
        Arrays.sort(perm);
        for (int i = 0; i < 9; i++)
        {
            Assert.assertEquals(i, perm[i]);
        }
    }


    @Test/**/
    public void test_makeRowPermutation_2()
    {
        // It is possible that the permutation will be the identity one. There is a chance in 9!.
        // A test that check that the permutation is never identity could eventually fail.
        // A less risky test is to check that 3 consecutive permutations are not equal.

        // Create n permutations
        final int n = 3;
        final int[][] perms = new int[n][];/**/
        for (int i = 0; i < n; i++) {
            final int[] perm = SudokuHelper.makeRowPermutation(i);
            Assert.assertEquals("should be the same size as board", 9, perm.length);
            perms[i] = perm;
        }

        // Compare permutation pairwise and count differences between their content.
        int diffCount = 0;
        for (int i = 0; i < n; i++) {
            final int[] permA = perms[i];
            for (int j = i + 1; j < n; j++) {
                final int[] permB = perms[j];
                for (int k = 0; k < 9; k++) {
                    if (permA[k] == permB[k]) diffCount++;
                }
            }
            verbose("diffCount=" + diffCount);
            Assert.assertTrue("There should be a least some difference", diffCount > 0);
        }
    }


    @Test
    public void test_makePermutation()
    {
        final Random random = new Random();
        for (int i = 0; i < 100; i++)
        {
            final int[] p = SudokuHelper.makePermutation(9, random.nextLong());
            //verbose("p=" + Arrays.toString(p));
            Assert.assertTrue(SudokuHelper.validatePermutation(p));
        }
    }

    @Test
    public void test_validatePermutation()
    {
        final int[][] good = new int[][]{
                   {0,1,2},
                   {0,2,1},
                   {1,0,2},
                   {1,2,0},
                   {2,0,1},
                   {2,1,0},
           };
        final int[][] bad = new int[][]{
                   {0,1,1},
                   {2,2,1},
                   {1,3,2},
                   {1,2,-1},
           };

        for (int[] aGood : good)
        {
            Assert.assertEquals(true, SudokuHelper.validatePermutation(aGood));
        }
        for (int[] aBad : bad)
        {
            Assert.assertEquals(false, SudokuHelper.validatePermutation(aBad));
        }
    }


    @Test
    public void test_validateRowPermutation()
    {
        final int[][] good = new int[][]{
                {0, 1, 2, 3, 4, 5, 6, 7, 8},
                {8, 7, 6, 5, 4, 3, 2, 1, 0},
                {0, 1, 2, 6, 7, 8, 3, 4, 5},
                {3, 4, 5, 0, 1, 2, 6, 7, 8},
                {3, 4, 5, 6, 7, 8, 0, 1, 2},
                {0, 2, 1, 5, 4, 3, 7, 6, 8},
                {8, 6, 7, 4, 5, 3, 0, 1, 2},
        };
        final int[][] bad = new int[][]{
                {0, 1, 2, 3, 4, 5, 6, 7},
                {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
                {3, 1, 2, 0, 4, 5, 6, 7, 8},
                {0, 1, 2, 3, 4, 8, 6, 7, 5},
                {0, 7, 2, 3, 4, 5, 6, 1, 8},
           };

        for (int[] aGood : good)
        {
            Assert.assertEquals(true, SudokuHelper.validateRowPermutation(aGood));
        }
        for (int[] aBad : bad)
        {
            Assert.assertEquals(false, SudokuHelper.validateRowPermutation(aBad));
        }
    }



    static final boolean verbose = true;

    static void verbose(final String s)
    {
        if (verbose) System.out.println(s);
    }
}
