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
    public void test_digitFromFlags()
    {
        // flags with a single set bit
        for (int digit = 0; digit < 9; digit++)
        {
            final int digit2 = CellState.digitFromFlags(0x1<<digit);
            Assert.assertEquals(digit, digit2);
        }

        // flags with a two set bits
        for (int digit = 0; digit < 8; digit++)
        {
            final int digit2 = CellState.digitFromFlags(0x3<<digit);
            Assert.assertEquals(-1, digit2);
        }
    }


    @Test
    public void test_countDigitFlags()
    {
        //flags 000000001 shifted
        for (int k=0; k<9; k++)
        {
            final int count = CellState.countDigitFlags(0x1<<k);
            Assert.assertEquals(1, count);
        }

        //flags 000000011 shifted
        for (int k=0; k<8; k++)
        {
            final int count = CellState.countDigitFlags(0x3<<k);
            Assert.assertEquals(2, count);
        }

        //flags 000000101 shifted
        for (int k=0; k<7; k++)
        {
            final int count = CellState.countDigitFlags(0x5<<k);
            Assert.assertEquals(2, count);
        }

        //flags 000010101 shifted
        for (int k=0; k<5; k++)
        {
            final int count = CellState.countDigitFlags(0x15<<k);
            Assert.assertEquals(3, count);
        }

        //flags 011111111 shifted
        for (int k=0; k<2; k++)
        {
            final int count = CellState.countDigitFlags(0xff<<k);
            Assert.assertEquals(8, count);
        }

        //flags 111111111
        {
            final int count = CellState.countDigitFlags(0x1ff);
            Assert.assertEquals(9, count);
        }
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
    public void test_getFirstDigitCandidate_1()
    {
        // Simple cases with only one candidate
        for (int k = 0; k < 9; k++)
        {
            final CellState cellState = CellState.KNOWN_DIGIT_STATE[k];

            Assert.assertEquals(k, cellState.getFirstDigitCandidate());
        }
    }

    @Test
    public void test_getFirstDigitCandidate_2()
    {
        // Cases with many candidates
        for (int k = 0; k < 9; k++)
        {
            int digitFlags = (CellState.ALL_FLAGS>>k)<<k;
            Assert.assertEquals(k, CellState.getFirstDigitCandidate(digitFlags));
        }
    }


}
