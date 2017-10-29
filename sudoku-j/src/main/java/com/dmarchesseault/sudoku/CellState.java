package com.dmarchesseault.sudoku;

import org.apache.log4j.Logger;
import static com.dmarchesseault.sudoku.SudokuConstants.CHECK_SANITY;

/**
 * An unsolved cell keeps track on the candidate value using a set of 9 bit flags.
 * When all flags but one are zeroed, the cell is solved.
 *
 */
//todo @Immutable
class CellState
{
    private static final Logger LOG = Logger.getLogger(CellState.class);

    // This initial state is that all digiets are candidates.
    static final int ALL_FLAGS = 0x1FF;
    static final CellState INIT_STATE = new CellState(ALL_FLAGS);

    // Constants for often used states for a cell with a known digit value
    static final CellState[] KNOWN_DIGIT_STATE = new CellState[9];
    static {
        for(int k = 0; k < KNOWN_DIGIT_STATE.length; k++) KNOWN_DIGIT_STATE[k] = new CellState(0x1<<k);
    }

    // For each candidate integer value of the cell, we have a flag bit.
    // Bit 0 is for UI digit 1, bit 8 is for UI digit 9.
    // Initially all flags are set. Flags are zeroed to exclude candidate values.
    private final int _digitFlags;

    // Keep track of the flags count to save on recalculations.
    //todo Unsure we need it. May be better to just recalculate.
    private final int _digitflagsCount;

    // Value really exists iif only one flag is set
    private final int _digit;


    CellState(int digitFlags)
    {
        _digitFlags = digitFlags;
        _digitflagsCount = countDigitFlags(_digitFlags);
        _digit = digitFromFlags(_digitFlags);
    }

    /**
     * Returns the digit solution from the flags.
     * The solution exists iif only one candidate flag is set.
     *
     * @param digitFlags candidate digits flags
     * @return solution digit or -1
     */
    static int digitFromFlags(final int digitFlags)
    {
        int ret = 0;
        final int digitflagsCount = countDigitFlags(digitFlags);
        if (digitflagsCount == 1)
        {
            // Determine which flag remains
            int flags = digitFlags;
            while ((flags >>= 1) != 0) ret++;
        }
        else
        {
            ret = -1;
        }
        return ret;
    }

    /**
     * Count the number of digit flags that are set.
     *
     * @param digitFlags candidate digits flags
     * @return number in the 0..9 range.
     */
    static int countDigitFlags(int digitFlags)
     {
         int ret = 0;

         int flags = digitFlags;
         for (int i = 0; i < 9; i++) // or while flags > 0
         {
             if ((flags & 0x1) > 0) ret++;
             flags >>= 1;
         }

         return ret;
     }

    static int makeDigitFlag(final int digit)
    {
        return 0x01 << digit;
    }


     boolean isSingleDigit()
     {
         return _digitflagsCount == 1;
     }


     int getDigitFlags()
     {
         //todo Mask off higher bits in case they are used for something
         // return _digitFlags & ALL_FLAGS;

         return _digitFlags;
     }

    int getDigitFlagsCount()
     {
         return _digitflagsCount;
     }

//     /**
//      * Applies the given mask to reset value flags.
//      *
//      * @param digitsMask bit mask
//      * @return the mask representing the values flags that were reset
//      */
//     private int changeResetDigitFlags(final int digitsMask) //todo remove
//     {
//         final int ret = _digitFlags & digitsMask;
//
//         _digitFlags &= ~digitsMask;
//
//         _digitflagsCount = countDigitFlags();
//         if (_digitflagsCount == 1)
//         {
//             // Determine which flag remains
//             _digit = 0;
//             int flags = _digitFlags;
//             while ((flags >>= 1) != 0) _digit++;
//         }
//
//         return ret;
//     }


//     /**
//      * Sets the state to reflect a unique digit
//      *
//      * @param digit Integer in 0..8 range, or -1
//      */
//     void setDigit(final int digit)
//     {
//         if (CHECK_SANITY)
//         {
//             if (!(-1 <= digit && digit < 9))
//             {
//                 throw new IllegalArgumentException();
//             }
//         }
//
//         this._digit = digit;
//         if (digit == -1)
//         {
//             _digitFlags = ALL_FLAGS;
//             _digitflagsCount = 9;
//         }
//         else
//         {
//             _digitFlags = 0x1 << digit;
//             _digitflagsCount = 1;
//         }
//     }

     int getDigit()
     {
         return _digit;
     }

     boolean isDigit(final int digit)
     {
         return _digit == digit;
     }

     boolean checkIntegrity()
     {
         boolean ret = true;

         if (!(1 <= _digitflagsCount && _digitflagsCount <= 9))
         {
             ret = false;
             LOG.warn("checkIntegrity: Inconsistency, out of range _digitflagsCount=" + _digitflagsCount);
         }

         final int digitFlagsCount = countDigitFlags(_digitFlags);
         if (_digitflagsCount != digitFlagsCount)
         {
             ret = false;
             LOG.warn("checkIntegrity: Inconsistency, _digitflagsCount=" + _digitflagsCount + " vs digitFlagsCount=" + digitFlagsCount);
         }

         if (!(-1 <= _digit && _digit < 9))
         {
             ret = false;
             LOG.warn("checkIntegrity: Inconsistency, out of range _digit=" + _digit);
         }

         if (digitFlagsCount == 1 && _digit == -1 || digitFlagsCount > 1 && _digit != -1)
         {
             ret = false;
             LOG.warn("checkIntegrity: Inconsistency, _digitflagsCount=" + _digitflagsCount +" vs _digit=" + _digit);
         }

         return ret;
     }

    /**
     * Return the first digit candidate, i.e. the first digit with a set flag.
     *
     * @return digit
     */
    int getFirstDigitCandidate()
    {
        return getFirstDigitCandidate(_digitFlags);
    }

    /**
     * Return the first digit candidate, i.e. the first digit with a set flag.
     *
     * @return digit
     */
    static int getFirstDigitCandidate(int digitFlags)
    {
        int digit = 0;
        while ((digitFlags & 0x1) == 0)
        {
            digitFlags >>>= 1;
            digit++;
        }
        return digit;
    }

     /**
      * Returns a string showing the flags that are set.
      * E.g. 0x143 --> "9.7....21"
      *
      * @return string
      */
     String getUiDigitFlagsString()
     {
         return digitFlagsToString(_digitFlags);
     }

    /**
      * Returns a string showing the flags that are set.
      * E.g. 0x143 --> "9.7....21"
      *
      * @return string
      */
     //todo move
     static String digitFlagsToString(int digitFlags)
     {
         final StringBuilder sb = new StringBuilder();

         for (int digit = 9, mask = 0x100; digit > 0; digit--, mask >>= 1)
         {
             if ((digitFlags & mask) != 0)
             {
                 sb.append(digit);
             }
             else
             {
                 sb.append('.');
             }
         }
         return sb.toString();
     }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CellState cellState = (CellState) o;

        if (_digit != cellState._digit) return false;
        if (_digitFlags != cellState._digitFlags) return false;
        if (_digitflagsCount != cellState._digitflagsCount) return false;

        return true;
    }

    @Override
    public int hashCode()
    {
        int result = _digitFlags;
        result = 31 * result + _digitflagsCount;
        result = 31 * result + _digit;
        return result;
    }

    /**
     * Tests whether the given digit is available in the flags.
     *
     * @param digit digit to test
     * @return true iif the digit is available, i.e. its flag is set
     */
    boolean includesDigit(int digit)
    {
        validateDigit(digit);

        return (_digitFlags & (1 << digit)) != 0;
    }


    static void validateDigit(final int digit)
    {
        if (CHECK_SANITY && !isDigitValid(digit))
        {
            throw new IllegalArgumentException("digit=" + digit);
        }
    }


    static boolean isDigitValid(final int digit)
    {
        return (0 <= digit && digit < 9);
    }

    @Override
    public String toString()
    {
        return "CellState{" +
                "_digitFlags=" + getUiDigitFlagsString() +
                ", _digitflagsCount=" + _digitflagsCount +
                ", _digit=" + _digit +
                '}';
    }
}
