package com.dmarchesseault.sudoku;

import junit.framework.Assert;
import org.junit.Test;

import java.util.*;

public class BoardTest
{

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


}
