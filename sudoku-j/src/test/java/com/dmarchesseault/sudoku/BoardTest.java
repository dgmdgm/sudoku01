package com.dmarchesseault.sudoku;

import junit.framework.Assert;
import org.apache.log4j.Logger;
import org.junit.Test;

import java.util.*;

public class BoardTest
{
    private static final Logger LOG = Logger.getLogger(BoardTest.class);

    @Test
    public void test_constructor()
    {
        final Board board = new Board();

        Assert.assertNotNull(board);
    }

    @Test
    public void test_groups()
    {
        final Board board = new Board();

        {
            final Cell[][] cellGroups = board.getCellsByRow();
            Assert.assertNotNull(cellGroups);

            // Verify that each cell appears once and only once.
            final Set<Cell> cellSet = new HashSet<Cell>();
            for (Cell[] cellGroup : cellGroups)
            {
                Collections.addAll(cellSet, cellGroup);
            }
            Assert.assertEquals(9 * 9, cellSet.size());
        }

        {
            final Cell[][] cellGroups = board.getCellsByCol();
            Assert.assertNotNull(cellGroups);

            // Verify that each cell appears once and only once.
            final Set<Cell> cellSet = new HashSet<Cell>();
            for (Cell[] cellGroup : cellGroups)
            {
                Collections.addAll(cellSet, cellGroup);
            }
            Assert.assertEquals(9 * 9, cellSet.size());
        }

        {
            final Cell[][] cellGroups = board.getCellsByBlock();
            Assert.assertNotNull(cellGroups);

            // Verify that each cell appears once and only once.
            final Set<Cell> cellSet = new HashSet<Cell>();
            for (Cell[] cellGroup : cellGroups)
            {
                Collections.addAll(cellSet, cellGroup);
            }
            Assert.assertEquals(9 * 9, cellSet.size());
        }

        {
            final Cell[][] cellGroups = board.getCellGroups();
            Assert.assertNotNull(cellGroups);

            // Verify that each cell appears 3 times
            final Map<Cell,Integer> cellMap = new HashMap<Cell, Integer>();
            for (Cell[] cellGroup : cellGroups)
            {
                for (Cell cell : cellGroup)
                {
                    final Integer count = cellMap.get(cell);
                    cellMap.put(cell, count != null ? count + 1 : 1);
                }
            }
            Assert.assertEquals(9 * 9, cellMap.size());
            for (final int count : cellMap.values())
            {
                Assert.assertEquals(3, count);
            }
        }
    }

    @Test
    public void test_undoLastChange() throws BoardSanityException
    {
        // Source board is a fixed reference
        final Board sourceBoard = new Board();
        SudokuHelper.populateBoardFromText(sourceBoard, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);
        final int sourceKnownDigitsCount = sourceBoard.getKnownDigitsCount();

        // Make sure the number of changes in the history will be large enough to be meaningful, say at least 10
        Assert.assertTrue("Should have a longer history to play with", 81-sourceKnownDigitsCount > 10);

        // Target board is initially identical
        final Board targetBoard = new Board();
        SudokuHelper.populateBoardFromText(targetBoard, SudokuSamples.SUDOKU_BOARD_SAMPLE_01);

        // Solve target board to have a history to play with
        LOG.debug("Target board before solving");
        LOG.debug(SudokuHelper.printBoardDigits(targetBoard, '.'));
        final SolverStrategy solverStrategy = new SolverStrategyComposite();
        solverStrategy.apply(targetBoard);
        LOG.debug("Target board after solving");
        LOG.debug(SudokuHelper.printBoardDigits(targetBoard, '.'));

        int targetKnownDigitsCount = targetBoard.getKnownDigitsCount();
        Assert.assertEquals("target board should be fully solved", 81, targetKnownDigitsCount);

        // Unwind solution history

        while(targetKnownDigitsCount  > sourceKnownDigitsCount)
        {
            CellChange cellChange = targetBoard.undoLastChange();
            Assert.assertNotSame("Should unwind only changes from solving history", CellChange.Reason.INIT, cellChange.getReason());
            if (cellChange.getCellStateAfter().isSingleDigit())
            {
                targetKnownDigitsCount--;
                Assert.assertEquals("known digits count should decrement", targetKnownDigitsCount, targetBoard.getKnownDigitsCount());
            }
        }
    }


    private void printBoard(final Board board, int hits)
    {
        if(LOG.isDebugEnabled())
        {
            LOG.debug(hits + " hits");
            LOG.debug(SudokuHelper.printBoardDigits(board, '.'));
            LOG.debug(SudokuHelper.printBoardDigitFlags(board));
        }
    }
}
