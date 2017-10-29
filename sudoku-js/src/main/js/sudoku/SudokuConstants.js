console && console.log("### SudokuConstants.js begin");

// namespace
(function(ns)
{

    //interface SudokuConstants
    let SudokuConstants = function()
    {
        throw new ns.NotInstantiableException();
    };


    //todo Should ensure CHECK_SANITY <= CHECK_SANITY_BASIC <= CHECK_SANITY_DEEP
    //todo test sanity check impact on performance
    SudokuConstants.CHECK_SANITY = true;
    SudokuConstants.CHECK_SANITY_BASIC = true;
    SudokuConstants.CHECK_SANITY_DEEP = false;

    /// exports
    ns.SudokuConstants = SudokuConstants;

}(Module("sudoku")));

console && console.log("### SudokuConstants.js end");
