console && console.log("### TestCase.js begin");

/**
 * Unit test base class
 */

(function (ns,lang,tools) {

    /**
     * Constructor
     *
     * @param options object with optional properties
     *   name: test name
     *   expectedExceptionType: expected exception type
     *   active: boolean telling if the test should be run
     * @param f  function the test runs
     * @constructor
     */
    ns.TestCase = function (options, f) {
        if (arguments.length > 2) {
            throw new lang.IllegalArgumentException("Not expecting more than 2 arguments.");
        }

        this._options = options || {name: "unkown", active: true};
        this._f = f;
    };

    ns.TestCase.prototype.LOG = ns.TestCase.LOG = Logger.getLogger("TestCase");

    /**
     * Runs the test case
     * @returns  1 if run with success, 0 otherwise.
     */
    ns.TestCase.prototype.runTest = function (options) {
        let ret = {name: this._options.name};
        if (this._options.active || (options && options.force)) {
            this.LOG.info("runTest: Running test " + this);
            const stopWatch = (new tools.StopWatch()).start();
            try {
                this._f.call();
                stopWatch.stop();
                this.LOG.info("runTest: SUCCESS, no exception, elapsed ms="+stopWatch.elapsed());
                ret.success = 1;
            } catch (e) {
                stopWatch.stop();
                //todo improve test
                if (e instanceof ns.FailedAssertionException) {
                    this.LOG.warn("runTest: FAILURE in test=" + this + ", e=" + e + ", elapsed ms="+stopWatch.elapsed());
                    ret.failure = 1;
                }
                else if (e instanceof lang.Exception && lang.Exception.isType(e, this._options.expectedExceptionType)) {
                    this.LOG.info("runTest: SUCCESS with expected exception type:" + e.getType()+ ", elapsed ms="+stopWatch.elapsed());
                    ret.success = 1;
                }
                else {
                    this.LOG.error("runTest: ERROR in test=" + this + ", e=" + e+ ", elapsed ms="+stopWatch.elapsed());
                    ret.error = 1;
                }
            }
            ret.elapsed = stopWatch.elapsed();
        }
        else {
            ret.skipped = 1;
            ret.elapsed = 0;
            this.LOG.warn("runTest: SKIPPED inactive test=" + this);
        }
        return ret;
    };


    ns.TestCase.prototype.toString = function () {
        return "TestCase{" +
            "_options:" + ns.TestCase.optionsToString(this._options) +
                //", _f:" + "..." +
            '}';
    };


    //todo should use generic function
    ns.TestCase.optionsToString = function (options) {
        let ret = "{";
        let moreThanOne = false;
        for (let key in options) {
            if (moreThanOne) ret += ", ";
            ret += key + ":" + options[key];
            moreThanOne = true;
        }
        ret += "}";
        return ret;
    };

//TestCase.prototype.assertEquals = Assert.assertEquals;
//TestCase.prototype.assertNotEquals = Assert.assertNotEquals;
//TestCase.prototype.assertFalse = Assert.assertFalse;
//TestCase.prototype.assertTrue = Assert.assertTrue;
//TestCase.prototype.assertNull = Assert.assertNull;
//TestCase.prototype.assertNotNull = Assert.assertNotNull;
//TestCase.prototype.assertUndefined = Assert.assertUndefined;
//TestCase.prototype.assertNotUndefined = Assert.assertNotUndefined;

}(Module("test"),Module("lang"),Module("tools")));

console && console.log("### TestCase.js end");
