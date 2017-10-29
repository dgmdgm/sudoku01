console && console.log("### XXX.js begin");

(function(ns)
{
    let LOG = Logger.getLogger("XXX");
    ns.xxxTestSuite = new test.TestSuite({name: "XXX"});

    ns.xxxTestSuite.addTest(new test.TestCase({name: "test_", active: true, expectedExceptionType: null}, function() {
    }));

}(Module("sudoku")));

console && console.log("### XXX.js end");
