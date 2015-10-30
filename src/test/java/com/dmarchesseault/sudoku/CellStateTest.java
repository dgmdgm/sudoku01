package com.dmarchesseault.sudoku;

import junit.framework.Assert;
import org.junit.Test;

public class CellStateTest
{

    @Test
    public void test_constructor()
    {
        final CellState cellState = CellState.INIT_STATE;

        Assert.assertEquals(CellState.ALL_FLAGS, cellState.getDigitFlags());
        Assert.assertEquals(-1, cellState.getDigit());
        Assert.assertEquals(9, cellState.getDigitFlagsCount());
    }

    @Test
    public void test_getValueFlagsString()
    {
        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[0];
            Assert.assertEquals("........1", cellState.getUiDigitFlagsString());
            Assert.assertEquals(0, cellState.getDigit());
            Assert.assertEquals(1, cellState.getDigitFlagsCount());
        }

        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[2];
            Assert.assertEquals("......3..", cellState.getUiDigitFlagsString());
            Assert.assertEquals(2, cellState.getDigit());
            Assert.assertEquals(1, cellState.getDigitFlagsCount());
        }

        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[6];
            Assert.assertEquals("..7......", cellState.getUiDigitFlagsString());
            Assert.assertEquals(6, cellState.getDigit());
            Assert.assertEquals(1, cellState.getDigitFlagsCount());
        }

        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[8];
            Assert.assertEquals("9........", cellState.getUiDigitFlagsString());
            Assert.assertEquals(8, cellState.getDigit());
            Assert.assertEquals(1, cellState.getDigitFlagsCount());
        }
    }

    @Test
    public void test_getFirstDigitCandidate()
    {
        for (int k = 0; k < 9; k++)
        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[k];

            Assert.assertEquals(k, cellState.getFirstDigitCandidate());
        }

    }



}
