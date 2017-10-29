console && console.log("### CellStateTest.js begin");

(function(ns,test)
{

    ns.cellStateTestSuite = new test.TestSuite({name: "CellStateTest"});


    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_constructor", active: true},
        function()
        {
            //final CellState cellState = CellState.INIT_STATE;
            cellState = ns.CellState.INIT_STATE;

            test.Assert.assertEquals(ns.CellState.ALL_FLAGS, cellState.getDigitFlags());
            test.Assert.assertEquals(-1, cellState.getDigit());
            test.Assert.assertEquals(9, cellState.getDigitFlagsCount());
        }));


    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_digitFromFlags", active: true},
        function()
        {
            // flags with a single set bit
            for (let digit = 0; digit < 9; digit++)
            {
                let digit2 = ns.CellState.digitFromFlags(0x1<<digit);
                test.Assert.assertEquals(digit, digit2);
            }

            // flags with a two set bits
            for (let digit = 0; digit < 8; digit++)
            {
                let digit2 = ns.CellState.digitFromFlags(0x3<<digit);
                test.Assert.assertEquals(-1, digit2);
            }
        }));


    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_countDigitFlags", active: true},
        function()
        {
                //flags 000000001 shifted
                for (let k=0; k<9; k++)
                {
                    const count = ns.CellState.countDigitFlags(0x1<<k);
                    test.Assert.assertEquals(1, count);
                }

                //flags 000000011 shifted
                for (let k=0; k<8; k++)
                {
                    const count = ns.CellState.countDigitFlags(0x3<<k);
                    test.Assert.assertEquals(2, count);
                }

                //flags 000000101 shifted
                for (let k=0; k<7; k++)
                {
                    const count = ns.CellState.countDigitFlags(0x5<<k);
                    test.Assert.assertEquals(2, count);
                }

                //flags 000010101 shifted
                for (let k=0; k<5; k++)
                {
                    const count = ns.CellState.countDigitFlags(0x15<<k);
                    test.Assert.assertEquals(3, count);
                }

                //flags 011111111 shifted
                for (let k=0; k<2; k++)
                {
                    const count = ns.CellState.countDigitFlags(0xff<<k);
                    test.Assert.assertEquals(8, count);
                }

                //flags 111111111
                {
                    const count = ns.CellState.countDigitFlags(0x1ff);
                    test.Assert.assertEquals(9, count);
                }
            }));


    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_getValueFlagsString", active: true},
        function()
        {
            {
                let cellState = ns.CellState.KNOWN_DIGIT_STATE[0];
                test.Assert.assertEquals("........1", cellState.getUiDigitFlagsString());
                test.Assert.assertEquals(0, cellState.getDigit());
                test.Assert.assertEquals(1, cellState.getDigitFlagsCount());
            }

            {
                let cellState = ns.CellState.KNOWN_DIGIT_STATE[2];
                test.Assert.assertEquals("......3..", cellState.getUiDigitFlagsString());
                test.Assert.assertEquals(2, cellState.getDigit());
                test.Assert.assertEquals(1, cellState.getDigitFlagsCount());
            }

            {
                let cellState = ns.CellState.KNOWN_DIGIT_STATE[6];
                test.Assert.assertEquals("..7......", cellState.getUiDigitFlagsString());
                test.Assert.assertEquals(6, cellState.getDigit());
                test.Assert.assertEquals(1, cellState.getDigitFlagsCount());
            }

            {
                let cellState = ns.CellState.KNOWN_DIGIT_STATE[8];
                test.Assert.assertEquals("9........", cellState.getUiDigitFlagsString());
                test.Assert.assertEquals(8, cellState.getDigit());
                test.Assert.assertEquals(1, cellState.getDigitFlagsCount());
            }
        }));

    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_getFirstDigitCandidate", active: true},
        function()
        {
            LOG = ns.cellStateTestSuite.LOG; //todo ugly
            LOG.trace("test_getFirstDigitCandidate_1: begin");

            for (let k = 0; k < 9; k++)
            {
                LOG.debug("test_getFirstDigitCandidate: k=" + k);
                let cellState = ns.CellState.KNOWN_DIGIT_STATE[k];
                LOG.debug("test_getFirstDigitCandidate: cellState=" + cellState);

                test.Assert.assertEquals(k, cellState.getFirstDigitCandidate());
            }
            LOG.trace("test_getFirstDigitCandidate: end");
        }));


    ns.cellStateTestSuite.addTest(new test.TestCase({name: "test_getFirstDigitCandidate_2", active: true},
        function()
        {
            // Cases with many candidates
            for (let k = 0; k < 9; k++)
            {
                let digitFlags = (ns.CellState.ALL_FLAGS>>k)<<k;
                test.Assert.assertEquals(k, ns.CellState.getFirstDigitCandidate(digitFlags));
            }
        }));


}(Module("sudoku"),Module("test")));

console && console.log("### CellStateTest.js end");

