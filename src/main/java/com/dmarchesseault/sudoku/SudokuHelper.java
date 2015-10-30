package com.dmarchesseault.sudoku;

import javafx.util.Pair;
import org.apache.log4j.Logger;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

class SudokuHelper implements SudokuConstants
{
    private static final Logger LOG = Logger.getLogger(SudokuHelper.class);



    /**
     * Populates board cells using a text representation as in {@link #makeDigitsFromString(String)}.
     *
     * @param text board content; each character is either a digit or a character we ignore. '.' is treated as '0'.
     */
    static Board populateBoardFromText(final Board board, final String text) throws BoardSanityException
    {
        final int digits[] = makeDigitsFromString(text);
        for (int k = 0; k < digits.length; k++)
        {
            final int digit = digits[k];
            if (digit != -1)
            {
//                board.changeCellDigit(i, digit, CellChange.Reason.INIT);
                board.getCell(k).changeToDigit(digit, CellChange.Reason.INIT);
            }
        }
        return board;
    }


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
    static int[] makeDigitsFromString(final String text)
    {
        final int[] ret = new int[9*9];

        // Transform into string with only digits in '0'..'9' range
        final String values = text.replaceAll("\\.", "0").replaceAll("\\D+", "");

        if (values.length() != 81)
        {
            throw new IllegalArgumentException("Digit count ("+values.length()+") should be 81.");
        }

        for (int k = 0; k < 9*9; k++)
        {
            final int digit = values.charAt(k) - '1';
            ret[k] = digit;
        }

        return ret;
    }


    static String printBoardDigits(final Board board)
    {
        return printBoardDigits(board, '.');
    }


    static String printBoardDigits(final Board board, char emptyCellChar)
    {
        return printBoardDigits(board,emptyCellChar,true);
    }

    static String printBoardDigits(final Board board, char emptyCellChar, boolean appendHistory)
    {
        final StringBuilder sb = new StringBuilder();

        int knownCount = 0;
        int unknownCount = 0;
        int unknownCandidatesCount = 0;

        for (int row = 0; row < 9; row++)
        {
            if (row % 3 == 0) sb.append("+-------+-------+-------+\n");
            for (int col = 0; col < 9; col++)
            {
                if (col == 0)
                {
                    sb.append("|");
                }
                else if (col % 3 == 0)
                {
                    sb.append(" |");
                }
                sb.append(" ");
                final Cell cell = board.getCell(row, col);
                final CellState cellState = cell.getCellState();
                final int digitFlagsCount = cellState.getDigitFlagsCount();
                if (digitFlagsCount == 1)
                {
                    knownCount++;
                }
                else
                {
                    unknownCount++;
                    unknownCandidatesCount += digitFlagsCount;
                }

                final int uiDigit = cell.getUiDigit();
                if (uiDigit == 0)
                {
                    sb.append(emptyCellChar);
                }
                else
                {
                    sb.append(uiDigit);
                }
            }
            sb.append(" |\n");
        }
        sb.append("+-------+-------+-------+\n");
        if (appendHistory)
        {
            sb.append(String.format("History: %d, Board known digits: %d,  Known: %d, Unknown: %d, Avg candidates per unknown: %4.2f;\n",
                    board.getHistory().size(), board.getKnownDigitsCount(), knownCount, unknownCount, unknownCandidatesCount/(double)unknownCount));
        }

        return sb.toString();
    }

    static String printBoardDigitFlags(final Board board)
    {
        final StringBuilder sb = new StringBuilder();

        for (int row = 0; row < 9; row++)
        {
            if (row % 3 == 0) sb.append("+-------------------------------+-------------------------------+-------------------------------+\n");
            for (int col = 0; col < 9; col++)
            {
                if (col == 0)
                {
                    sb.append("|");
                }
                else if (col % 3 == 0)
                {
                    sb.append(" |");
                }
                sb.append(" ");
                final String value = board.getCell(row, col).getUiDigitFlagsString();
                sb.append(value);
            }
            sb.append(" |\n");
        }
        sb.append("+-------------------------------+-------------------------------+-------------------------------+\n");
        return sb.toString();
    }


    /**
     * Pupulates the board with random digits
     *
     * @param n number of digits.
     */
    //todo Buggy. May fail to fill n cells. Board may be invalid.
    //todo Implement starting with a full board and removing cells. Apply random permutations of rows and columns.
    static void populateBoardRandomly(final Board targetBoard, final int n)
    {
        if (targetBoard.getKnownDigitsCount() > 0)
        {
            //todo board not empty
        }

        //todo add safeguard to prevent infinite loop

        final Random random = new Random(System.currentTimeMillis());

        // To avoid collisions from cell index reuse, we use a list of indices and remove them one by one.
        final List<Integer> cellChoices = new ArrayList<Integer>(81);
        for (int i = 0; i < 81; i++) cellChoices.add(i);

        int cellCount = 0;
        // Loop until we have reached the target number of cells or we exhausted the choices
        while (cellCount < n && cellChoices.size() > 0)
        {
            // Pick random cell index in 0..80 range
            final int cellChoice = (int)(random.nextDouble() * cellChoices.size());
            final int cellIndex = cellChoices.remove(cellChoice);

            final List<Integer> digitChoices = new ArrayList<Integer>(9);
            for (int i = 0; i < 9; i++) digitChoices.add(i);

            int digitCount = 0;
            // Loop until we have a digit or we exhausted the choices
            while (digitCount < 1 && digitChoices.size() > 0)
            {
                // Pick random digit in 0..8 range
                final int digitChoice = (int)(random.nextDouble() * digitChoices.size());
                final int digit = digitChoices.remove(digitChoice);
                final Cell targetCell = targetBoard.getCell(cellIndex);

                try
                {
                    targetCell.changeToDigit(digit, CellChange.Reason.INIT);
                    digitCount++;
                }
                catch (BoardSanityException e)
                {
                    // Oups, that digit conflicts
                    LOG.debug("populateBoardRandomly", e);
                    // Undo change
                    final CellChange cellChange = targetBoard.getHistory().peekLast();
                    try
                    {
                        cellChange.getCell().unchange(cellChange);
                    }
                    catch (BoardSanityException e1)
                    {
                        LOG.debug("populateBoardRandomly: unexpected problem", e1);
                    }
                }

            }
            cellCount += digitCount;
        }
    }


    /**
     * Populates the board with random digits
     *
     * @param targetBoard board to fill
     * @param sourceBoard full solution board
     * @param rowPermutation row permutation or null
     * @param colPermutation column permutation or null
     */
    static void populatePermutatedBoard(final Board targetBoard, final Board sourceBoard, int[] rowPermutation, int[] colPermutation)
    {

        for (int sourceRow = 0; sourceRow < 9; sourceRow++)
        {
            for (int sourceCol = 0; sourceCol < 9; sourceCol++)
            {
                final int targetRow = rowPermutation == null ? sourceRow : rowPermutation[sourceRow];
                final int targetCol = colPermutation == null ? sourceRow : colPermutation[sourceCol];
                final Cell sourceCell = sourceBoard.getCell(sourceRow,sourceCol);

                try
                {
                    final int digit = sourceCell.getCellState().getDigit();

                    targetBoard.getCell(targetRow,targetCol).changeToDigit(digit, CellChange.Reason.INIT);
                }
                catch (BoardSanityException e)
                {
                    // There should not be exceptions if the source board is valid.
                    LOG.debug("populatePermutatedBoard", e);
                }
            }
        }
    }


    /**
     * Populates the board with random digits
     *
     * @param targetBoard target board
     * @param solvedBoard source board, by assumption a solved board.
     * @param n number of digits.
     */
    static void populateBoardFromSolution(final Board targetBoard, final Board solvedBoard, final int n)
    {
        if (targetBoard.getKnownDigitsCount() > 0)
        {
            //todo board not empty
        }

        final Random random = new Random(System.currentTimeMillis());

        // To avoid cell index collisions, we use a list of indices and remove them one by one.
        final List<Integer> cellChoices = new ArrayList<Integer>(81);
        for (int i = 0; i < 81; i++) cellChoices.add(i);

        for (int cellCount = 0; cellCount < n; cellCount++)
        {
            // Pick random cell index in 0..80 range
            final int cellChoice = (int)(random.nextDouble() * cellChoices.size());
            final int cellIndex = cellChoices.remove(cellChoice);
            final Cell sourceCell = solvedBoard.getCell(cellIndex);
            final int digit = sourceCell.getCellState().getDigit();

            try
            {
                final Cell targetCell = targetBoard.getCell(cellIndex);
                targetCell.changeToDigit(digit, CellChange.Reason.INIT);
            }
            catch (BoardSanityException e)
            {
                // There should not be exceptions if the solved board is valid.
                LOG.debug("populateBoardFromSolution", e);
            }
        }
    }


    /**
     * Makes a permutation of the indices usable for rows or columns.
     * The 3 groups of 3 consecutive rows can be permuted with each other, as can the 3 rows within the group.
     * There are 6 permutations of 3 elements, so there are 6**4 permutation of rows.
     *
     * @return permutation expressed as and array of indirections.
     */
    static int[]  makeRowPermutation()
    {
        return makeRowPermutation(System.currentTimeMillis());
    }


    /**
     * Makes a permutation of the indices usable for rows or columns.
     * The 3 groups of 3 consecutive rows can be permuted with each other, as can the 3 rows within the group.
     * There are 6 permutations of 3 elements, so there are 6**4 permutations of rows.
     *
     * @param seed randomization seed
     * @return permutation expressed as and array of indirections.
     */
    static int[]  makeRowPermutation(long seed)
    {
        int[] ret = new int[9];

        // There are 6 permutations of 3 elements
        final int[][] permutations3 = new int[][]{
                {0,1,2},
                {0,2,1},
                {1,0,2},
                {1,2,0},
                {2,0,1},
                {2,1,0},
        };

        final Random random = new Random(seed);

        // Permutation of groups
        final int[] p1 = permutations3[(int)(random.nextDouble() * 6)];
        for (int i = 0; i < 3; i++)
        {
            // Permutation in group
            final int[] p2 = permutations3[(int)(random.nextDouble() * 6)];
            for (int j = 0; j < 3; j++)
            {
                ret[i * 3 + j] = p1[i] * 3 + p2[j];
            }
        }

        return ret;
    }


    /**
     * Makes a permutation of the given length.
     *
     * @param n length of permutation
     * @param seed randomization seed
     * @return permutation expressed as and array of indirections.
     */
    static int[]  makePermutation(final int n, long seed)
    {
        int[] ret = new int[n];

        final List<Integer> choices = new ArrayList<Integer>(81);
        for (int i = 0; i < n; i++) choices.add(i);

        final Random random = new Random(seed);

        for (int i = 0; i < n; i++)
        {
            // Permutation in group
            ret[i] = choices.remove((int)(random.nextDouble() * choices.size()));
        }

        return ret;
    }


    /**
     * Finds the permutation that maps the source array to the target array.
     *
     * @param source source board
     * @param target target board
     * @return Pair of permutations for rows and columns. Null means failure.
     */
    static int[] findPermutation(final int[] source, final int[] target)
    {
        if (source.length != target.length || !validatePermutation(source) || !validatePermutation(target))
        {
            return null;
        }

        // Map each target value to its index in target
        final int[] targetLocations = new int[source.length];
        for (int i = 0; i < source.length; i++)
        {
            targetLocations[target[i]] = i;
        }

        // Map each index in source to its index in target
        final int[] ret = new int[source.length];
        for (int i = 0; i < source.length; i++)
        {
            ret[i] = targetLocations[source[i]];
        }
        return ret;
    }

    /**
     * Compare two solved board and tries to determine the row and column permutation that would transform the
     * source board into the target board.
     *
     * @param sourceBoard source board
     * @param targetBoard target board
     * @return Pair of permutations for rows and columns. Null means failure.
     */
    static Pair<int[], int[]>  findPermutation(final Board sourceBoard, final Board targetBoard)
    {
        // Source and targets digits on first column
        final int[] sourceColDigits = new int[9];
        final int[] targetColDigits = new int[9];
        for (int i = 0; i < 9; i++)
        {
            sourceColDigits[i] = sourceBoard.getCell(i, 0).getDigit();
            targetColDigits[i] = targetBoard.getCell(i, 0).getDigit();
        }

        final int[] pRows = findPermutation(sourceColDigits,targetColDigits);

        if (!validateRowPermutation(pRows))
        {
            return null;
        }

        // Source and targets digits on first row
        // We have to compare with the transformed one
        final int[] sourceRowDigits = new int[9];
        final int[] targetRowDigits = new int[9];
        for (int i = 0; i < 9; i++)
        {
            sourceRowDigits[i] = sourceBoard.getCell(0, i).getDigit();
            targetRowDigits[i] = targetBoard.getCell(pRows[0], i).getDigit();
        }

        final int[] pCols = findPermutation(sourceRowDigits, targetRowDigits);

        // Validate group permutation by making sure each index appears once.
        if (!validateRowPermutation(pCols))
        {
            return null;
        }

        return new Pair<int[], int[]>(pRows,pCols);
    }

    /**
     * Tests that the permutation is valid.
     * Each source index must must mapped to a target index that is the same group of 3 columns.
     *
     * @param p permutation
     * @return true means valid
     */
    static boolean validateRowPermutation(final int[] p)
    {
        if (p.length != 9)
        {
//            throw new IllegalArgumentException("Size must be 9");
            return false;
        }

        boolean ret = validatePermutation(p);

        // Columns in a group must stay together in the target group
        for (int sourceGroupIndex = 0; sourceGroupIndex < 3 && ret; sourceGroupIndex++)
        {
            final int targetGroupIndex0 = p[sourceGroupIndex * 3 + 0] / 3;
            final int targetGroupIndex1 = p[sourceGroupIndex * 3 + 1] / 3;
            final int targetGroupIndex2 = p[sourceGroupIndex * 3 + 2] / 3;

            ret = targetGroupIndex0 == targetGroupIndex1 && targetGroupIndex0 == targetGroupIndex2;
        }
        return ret;
    }

    /**
     * Tests that the permutation is valid.
     * Each index must appear once.
     *
     * @param p permutation
     * @return true means valid
     */
    static boolean validatePermutation(final int[] p)
    {

//        // Expensive quadratic implementation
//        for (int i=0; i<9; i++)
//        {
//            int count = 0;
//            for (int j=0; j<9; j++)
//            {
//                if (p[j] == i) count++;
//            }
//            Assert.assertEquals(1, count);
//        }

        if (p.length > 32)
        {
            throw new IllegalArgumentException("Permutation length limited to 32.");
        }

        int actual = 0;
        int expected = 0;
        for (int i : p)
        {
            expected = (expected << 1) | 0x1;
            actual |= 0x1 << i;
        }
        return actual == expected;
    }


}
