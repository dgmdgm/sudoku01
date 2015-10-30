package com.dmarchesseault.sudoku;

import junit.framework.Assert;
import org.junit.*;

public class CellTest
{

    @Test
    public void test_constructor_1()
    {
        {
            final Cell cell = new Cell(null, 0,0);
            Assert.assertEquals(CellState.INIT_STATE, cell.getCellState());
            Assert.assertEquals(0, cell.getRow());
            Assert.assertEquals(0, cell.getCol());
            Assert.assertEquals(0, cell.getBlockIndex());
            Assert.assertEquals(0, cell.getIndexInBlock());
        }
        {
            final Cell cell = new Cell(null, 4,7);
            Assert.assertEquals(CellState.INIT_STATE, cell.getCellState());
            Assert.assertEquals(4, cell.getRow());
            Assert.assertEquals(7, cell.getCol());
            Assert.assertEquals(5, cell.getBlockIndex());
            Assert.assertEquals(4, cell.getIndexInBlock());
        }
        {
            final Cell cell = new Cell(null, 8,8);
            Assert.assertEquals(CellState.INIT_STATE, cell.getCellState());
            Assert.assertEquals(8, cell.getRow());
            Assert.assertEquals(8, cell.getCol());
            Assert.assertEquals(8, cell.getBlockIndex());
            Assert.assertEquals(8, cell.getIndexInBlock());
        }
    }

    @Test(expected=IllegalArgumentException.class)
    public void test_constructor_2()
    {
        final Cell cell = new Cell(null, 9,9);
    }

    @Test
    public void test_getUiDigitFlagsString() throws BoardSanityException
    {
        {
            final Cell cell = new Cell(null, 0, 0);
            cell.changeToDigit(0, CellChange.Reason.INIT);
            Assert.assertEquals("........1", cell.getUiDigitFlagsString());
        }

        {
            final Cell cell = new Cell(null, 0, 0);
            cell.changeToDigit(2, CellChange.Reason.INIT);
            Assert.assertEquals("......3..", cell.getUiDigitFlagsString());
        }

        {
            final Cell cell = new Cell(null, 0, 0);
            cell.changeToDigit(6, CellChange.Reason.INIT);
            Assert.assertEquals("..7......", cell.getUiDigitFlagsString());
        }

        {
            final Cell cell = new Cell(null, 0, 0);
            cell.changeToDigit(8, CellChange.Reason.INIT);
            Assert.assertEquals("9........", cell.getUiDigitFlagsString());
        }
    }

}
