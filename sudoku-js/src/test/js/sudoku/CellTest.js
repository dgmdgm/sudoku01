console && console.log("### CellTest.js begin");

(function(ns,test,lang)
{
    ns.cellTestSuite = new test.TestSuite({name: "CellTest"});


    ns.cellTestSuite.addTest(new test.TestCase({name: "test_constructor_1", active: true},
        function()
        {
            {
                let cell = new ns.Cell(null, 0,0);
                test.Assert.assertEquals(ns.CellState.INIT_STATE, cell.getCellState());
                test.Assert.assertEquals(0, cell.getRow());
                test.Assert.assertEquals(0, cell.getCol());
                test.Assert.assertEquals(0, cell.getBlockIndex());
                test.Assert.assertEquals(0, cell.getIndexInBlock());
            }
            {
                let cell = new ns.Cell(null, 4,7);
                test.Assert.assertEquals(ns.CellState.INIT_STATE, cell.getCellState());
                test.Assert.assertEquals(4, cell.getRow());
                test.Assert.assertEquals(7, cell.getCol());
                test.Assert.assertEquals(5, cell.getBlockIndex());
                test.Assert.assertEquals(4, cell.getIndexInBlock());
            }
            {
                let cell = new ns.Cell(null, 8,8);
                test.Assert.assertEquals(ns.CellState.INIT_STATE, cell.getCellState());
                test.Assert.assertEquals(8, cell.getRow());
                test.Assert.assertEquals(8, cell.getCol());
                test.Assert.assertEquals(8, cell.getBlockIndex());
                test.Assert.assertEquals(8, cell.getIndexInBlock());
            }
        }
        ));


    //todo    @Test(expected=IllegalArgumentException.class)
    ns.cellTestSuite.addTest(new test.TestCase({name: "test_constructor_2", expectedExceptionType: lang.IllegalArgumentException.TYPE, active: true},
        function() {
            let cell = new ns.Cell(null, 9, 9);
        }));


    ns.cellTestSuite.addTest(new test.TestCase({name: "test_getUiDigitFlagsString", active: true},
        function()
        {
            {
                let cell = new ns.Cell(null, 0, 0);
                cell.changeToDigit(0, ns.CellChange.Reason.INIT);
                test.Assert.assertEquals("........1", cell.getUiDigitFlagsString());
            }

            {
                let cell = new ns.Cell(null, 0, 0);
                cell.changeToDigit(2, ns.CellChange.Reason.INIT);
                test.Assert.assertEquals("......3..", cell.getUiDigitFlagsString());
            }

            {
                let cell = new ns.Cell(null, 0, 0);
                cell.changeToDigit(6, ns.CellChange.Reason.INIT);
                test.Assert.assertEquals("..7......", cell.getUiDigitFlagsString());
            }

            {
                let cell = new ns.Cell(null, 0, 0);
                cell.changeToDigit(8, ns.CellChange.Reason.INIT);
                test.Assert.assertEquals("9........", cell.getUiDigitFlagsString());
            }
        }));

}(Module("sudoku"),Module("test"),Module("lang")));

console && console.log("### CellTest.js end");
