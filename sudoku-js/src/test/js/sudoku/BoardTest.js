console && console.log("### ns.BoardTest.js begin");


(function(ns,test,util)
{
    let LOG = Logger.getLogger("BoardTest");
    ns.boardTestSuite = new test.TestSuite({name: "BoardTest"});

    //@Test
    //public void test_constructor()
    ns.boardTestSuite.addTest(new test.TestCase({name: "test_constructor", active: true}, function() {
        const board = new ns.Board();
        test.Assert.assertNotNull(board);
    }));
    
    
    //@Test
    //public void test_groups()
    ns.boardTestSuite.addTest(new test.TestCase({name: "test_groups", active: true}, function() {
        const board = new ns.Board();


        // Verify that each cell appears once and only once in the cell groups
        let testCellGroup = function(cellGroups)
        {
            test.Assert.assertNotNull(cellGroups);

            // Verify that each cell appears once and only once.
            const cellSet = new util.Set();
            for (let groupKey in cellGroups)
            {
                const cellGroup = cellGroups[groupKey];
                // Add all cells of cellGroup to the set. The Set add method accepts multiple args.
                //cellSet.add.apply(cellSet,cellGroup);
                cellGroup.forEach(function(cell){
                    cellSet.add(cell);
                });
            }
            test.Assert.assertEquals(9 * 9, cellSet.size());
        };

        testCellGroup(board.getCellsByRow());
        testCellGroup(board.getCellsByCol());
        testCellGroup(board.getCellsByBlock());

        {
            const cellGroups = board.getCellGroups();
            test.Assert.assertNotNull(cellGroups);

            // Verify that each cell appears 3 times
            //*** Ugly kludge to replace missing Map
            // Instead of counting up to 3 in a map, wet keep 3 sets. :(
            const cellSet1 = new util.Set();
            const cellSet2 = new util.Set();
            const cellSet3 = new util.Set();
            for (let groupKey in cellGroups)
            {
                const cellGroup = cellGroups[groupKey];
                for (let cellKey in cellGroup)
                {
                    const cell = cellGroup[cellKey];

                    if (!cellSet1.contains(cell))
                    {
                        cellSet1.add(cell);
                    }
                    else if (!cellSet2.contains(cell))
                    {
                        cellSet2.add(cell);
                    }
                    else if (!cellSet3.contains(cell))
                    {
                        cellSet3.add(cell);
                    }
                    else
                    {
                        test.Assert.fail("more than 3 occurences of cell="+cell);
                    }
                }
            }
            test.Assert.assertEquals("cellSet1", 9 * 9, cellSet1.size());
            test.Assert.assertEquals("cellSet2", 9 * 9, cellSet2.size());
            test.Assert.assertEquals("cellSet3", 9 * 9, cellSet3.size());
        }
    }));

}(Module("sudoku"),Module("test"),Module("util"),Module("lang")));

console && console.log("### ns.BoardTest.js end");

        
