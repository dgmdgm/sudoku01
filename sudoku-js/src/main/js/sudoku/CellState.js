console && console.log("### CellState.js begin");

(function(ns,lang)
{
    /**
     * An unsolved cell keeps track on the candidate value using a set of 9 bit flags.
     * When all flags but one are zeroed, the cell is solved.
     *
     */
    //todo @Immutable
    //class CellState
    ns.CellState = function(digitFlags)
    {
        //LOG.trace("CellState: begin, this=" + this + ", __proto__=" + this.__proto__);

        //let ALL_FLAGS = CellState.ALL_FLAGS;
        //let INIT_STATE = CellState.INIT_STATE;
        //let KNOWN_DIGIT_STATE = CellState.KNOWN_DIGIT_STATE;

        // For each candidate integer value of the cell, we have a flag bit.
        // Bit 0 is for UI digit 1, bit 8 is for UI digit 9.
        // Initially all flags are set. Flags are zeroed to exclude candidate values.
        this._digitFlags = digitFlags;

        // Keep track of the flags count to save on recalculations.
        //todo Unsure we need it. May be better to just recalculate.
        this._digitflagsCount = ns.CellState.countDigitFlags(digitFlags);

        this._digit = ns.CellState.digitFromFlags(digitFlags);

        //LOG.trace("CellState: end, this=" + this);
    };

    /**
     * Count the number of digit flags that are set.
     *
     * @param digitFlags candidate digits flags
     * @return number in the 0..9 range.
     */
    //static int countDigitFlags(int digitFlags)
    ns.CellState.prototype.digitFromFlags =
        ns.CellState.digitFromFlags = function(digitFlags)
    {
        let ret = 0;
        const digitflagsCount = this.countDigitFlags(digitFlags);
        if (digitflagsCount === 1)
        {
            // Determine which flag remains
            let flags = digitFlags;
            while ((flags >>= 1) !== 0) ret++;
        }
        else
        {
            ret = -1;
        }
        return ret;
    };

    /**
     * Count the number of digit flags that are set.
     *
     * @param digitFlags candidate digits flags
     * @return number in the 0..9 range.
     */
    //static int countDigitFlags(int digitFlags)
    ns.CellState.prototype.countDigitFlags =
        ns.CellState.countDigitFlags = function(digitFlags)
     {
         let ret = 0;

         let flags = digitFlags;
         for (let i = 0; i < 9; i++) // or while flags > 0
         {
             if ((flags & 0x1) > 0) ret++;
             flags >>= 1;
         }

         return ret;
     };

    //static int makeDigitFlag(final int digit)
    ns.CellState.prototype.makeDigitFlag =
    ns.CellState.makeDigitFlag = function(digit)
    {
        return 0x01 << digit;
    };


     //boolean isSingleDigit()
    ns.CellState.prototype.isSingleDigit = function()
    {
        return this._digitflagsCount === 1;
    };


    //int getDigitFlags()
    ns.CellState.prototype.getDigitFlags = function()
    {
        //todo Mask off higher bits in case they are used for something
        // return _digitFlags & ALL_FLAGS;

        return this._digitFlags;
    };

    //int getDigitFlagsCount()
    ns.CellState.prototype.getDigitFlagsCount = function()
    {
        return this._digitflagsCount;
    };

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
//         if (_digitflagsCount === 1)
//         {
//             // Determine which flag remains
//             _digit = 0;
//             int flags = _digitFlags;
//             while ((flags >>= 1) !== 0) _digit++;
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
//         if (digit === -1)
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

     //int getDigit()
    ns.CellState.prototype.getDigit = function()
     {
         return this._digit;
     };

     //boolean isDigit(final int digit)
    ns.CellState.prototype.isDigit = function(digit)
     {
         return this._digit === digit;
     };

     //boolean checkIntegrity()
    ns.CellState.prototype.checkIntegrity = function()
    {
        let ret = true;

        if (!(1 <= this._digitflagsCount && this._digitflagsCount <= 9)) {
            ret = false;
            this.LOG.warn("checkIntegrity: Inconsistency, out of range _digitflagsCount=" + this._digitflagsCount);
        }

        let digitFlagsCount = countDigitFlags(this._digitFlags);
        if (this._digitflagsCount !== digitFlagsCount) {
            ret = false;
            this.LOG.warn("checkIntegrity: Inconsistency, _digitflagsCount=" + this._digitflagsCount + " vs digitFlagsCount=" + digitFlagsCount);
        }

        if (!(-1 <= this._digit && this._digit < 9)) {
            ret = false;
            this.LOG.warn("checkIntegrity: Inconsistency, out of range _digit=" + this._digit);
        }

        if (digitFlagsCount === 1 && this._digit === -1 || digitFlagsCount > 1 && this._digit !== -1) {
            ret = false;
            this.LOG.warn("checkIntegrity: Inconsistency, _digitflagsCount=" + this._digitflagsCount + " vs _digit=" + this._digit);
        }

        return ret;
    };

    /**
     * Return the first digit candidate, i.e. the first digit with a set flag.
     *
     * @return digit
     */
    //int getFirstDigitCandidate()
    ns.CellState.prototype.getFirstDigitCandidate = function()
    {
        return ns.CellState.getFirstDigitCandidate(this._digitFlags);
    };

    /**
     * Return the first digit candidate, i.e. the first digit with a set flag.
     *
     * @return digit
     */
    //static int getFirstDigitCandidate(int digitFlags)
    ns.CellState.getFirstDigitCandidate = function(digitFlags)
    {
        let digit = 0;
        while ((digitFlags & 0x1) === 0)
        {
            digitFlags >>>= 1;
            digit++;
        }
        return digit;
    };

     /**
      * Returns a string showing the flags that are set.
      * E.g. 0x143 --> "9.7....21"
      *
      * @return string
      */
     //String getUiDigitFlagsString()
     ns.CellState.prototype.getUiDigitFlagsString = function()
     {
         return ns.CellState.digitFlagsToString(this._digitFlags);
     };

    /**
      * Returns a string showing the flags that are set.
      * E.g. 0x143 --> "9.7....21"
      *
      * @return string
      */
     //todo move
     //static String digitFlagsToString(int digitFlags)
    ns.CellState.digitFlagsToString = function(digitFlags)
     {
         let sb = "";

         for (let digit = 9, mask = 0x100; digit > 0; digit--, mask >>= 1)
         {
             sb += (digitFlags & mask) !== 0 ? digit : ".";
         }
         return sb.toString();
     };

    //@Override
    //public boolean equals(Object o)
    ns.CellState.prototype.equals = function(o)
    {
        if (!o || !o instanceof ns.CellState) return false;

        let cellState = o;

        if (this._digit !== cellState._digit) return false;
        if (this._digitFlags !== cellState._digitFlags) return false;
        if (this._digitflagsCount !== cellState._digitflagsCount) return false;

        return true;
    };

    //@Override
    //public int hashCode()
    ns.CellState.prototype.hashCode = function()
    {
        let result = this._digitFlags;
        result = 31 * result + this._digitflagsCount;
        result = 31 * result + this._digit;
        return result;
    };

    /**
     * Tests whether the given digit is available in the flags.
     *
     * @param digit digit to test
     * @return true iif the digit is available, i.e. its flag is set
     */
    //boolean includesDigit(int digit)
    ns.CellState.prototype.includesDigit = function(digit)
    {
        this.validateDigit(digit);

        return (this._digitFlags & (1 << digit)) !== 0;
    };


    //static void validateDigit(final int digit)
    ns.CellState.prototype.validateDigit = function(digit)
    {
        if (ns.SudokuConstants.CHECK_SANITY && !this.isDigitValid(digit))
        {
            throw new lang.IllegalArgumentException("digit=" + digit);
        }
    };


    //static boolean isDigitValid(final int digit)
    ns.CellState.prototype.isDigitValid = function(digit)
    {
        return (0 <= digit && digit < 9);
    };

    //@Override
    //public String toString()
    ns.CellState.prototype.toString = function()
    {
        return "CellState{" +
                "_digitFlags:" + this.getUiDigitFlagsString() +
                ", _digitflagsCount:" + this._digitflagsCount +
                ", _digit:" + this._digit +
                '}';
    };


    ns.CellState.prototype.LOG = ns.CellState.LOG = Logger.getLogger("CellState");

    ns.CellState.ALL_FLAGS= 0x1FF;
    ns.CellState.INIT_STATE = new ns.CellState(ns.CellState.ALL_FLAGS);

    // Often used states for a cell with a known digit value
    //static CellState[] KNOWN_DIGIT_STATE = new CellState[9];
    ns.CellState.KNOWN_DIGIT_STATE = new Array(9);
    for (let k = 0; k < ns.CellState.KNOWN_DIGIT_STATE.length; k++) ns.CellState.KNOWN_DIGIT_STATE[k] = new ns.CellState(0x1 << k);

}(Module("sudoku"),Module("lang")));

console && console.log("### CellState.js end");
