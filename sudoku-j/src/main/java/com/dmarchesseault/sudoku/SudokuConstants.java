package com.dmarchesseault.sudoku;

interface SudokuConstants
{

    //todo Should ensure CHECK_SANITY <= CHECK_SANITY_BASIC <= CHECK_SANITY_DEEP
    //todo test sanity check impact on performance
    boolean CHECK_SANITY = true;
    boolean CHECK_SANITY_BASIC = true;
    boolean CHECK_SANITY_DEEP = false;
}
