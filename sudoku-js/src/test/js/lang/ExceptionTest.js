console && console.log("### ExceptionTest.js begin");

(function(ns,test)
{
    let LOG = Logger.getLogger("ExceptionTest");
    ns.exceptionTestSuite = new test.TestSuite({name: "ExceptionTest"});

    ns.exceptionTestSuite.addTest(new test.TestCase({name: "test_constructor_1", active: true, expectedExceptionType: null}, function() {

        {
            var type = "MyType";
            let msg = "blabla";
            let e = new ns.Exception(type, msg);

            test.Assert.assertEquals(type, e.getType());
            test.Assert.assertEquals(msg, e.getMsg());
            test.Assert.assertNotNull(e.getStack());
        }

    }));

    //ns.exceptionTestSuite.addTest(new test.TestCase({name: "test_", active: true, expectedExceptionType: null}, function() {
    //}));

}(Module("sudoku"),Module("test")));

console && console.log("### ExceptionTest.js end");
