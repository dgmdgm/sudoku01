console && console.log("### TestSuite.js begin");

/**
 * Unit test suite class
 */

(function (ns,lang,tools) {
    /**
     * Constructor
     *
     * @param options object with test suite options. TBD
     */
    ns.TestSuite = function(options)
    {
        this._options = options || {name: "unkown", active: true};
        this._tests = [];
    };


    /**
     * Adds a test to the suite
     * @param test
     */
    ns.TestSuite.prototype.addTest = function(test)
    {
        this.LOG.trace("addTest: begin, test" + test);

        this.LOG.debug("addTest: _tests=" + this._tests);
        this._tests.push(test);

        this.LOG.trace("addTest: end");
    };

    /**
     * Runs the test in the suite
     */
    ns.TestSuite.prototype.runTests = function(options)
    {
        let LOG = this.LOG;
        LOG.trace("runTests: begin");

        let ret = {name: this._options.name, skipped: 0, success: 0, failure: 0, error: 0};
        this.LOG.debug("runTests: Running test suite " + this._options.name);

        const stopWatch = (new tools.StopWatch()).start();
        for(let testKey in this._tests)
        {
            try
            {
                const test = this._tests[testKey];
                LOG.debug("runTests: running test " + test);
                const score = test.runTest(options);
                ret.skipped += score.skipped || 0;
                ret.success += score.success || 0;
                ret.failure += score.failure || 0;
                ret.error += score.error || 0;
                LOG.debug("runTests: score so far" +
                    ": skipped=" + ret.skipped +
                    ", success=" + ret.success +
                    ", failure=" + ret.failure +
                    ", error=" + ret.error);
            }
            catch (e)
            {
                ++ret.error;
                LOG.error("runTests: Unexpected error: " + e);
            }
            finally {
            }
        }
        stopWatch.stop();

        if(ret.skipped > 0) this.LOG.warn("SKIPPED: " + ret.skipped + "/" + this._tests.length);
        this.LOG.info("SUCCESS: " + ret.success + "/" + this._tests.length);
        if(ret.failure > 0) this.LOG.warn("FAILURE: " + ret.skipped + "/" + this._tests.length);
        if(ret.error > 0) this.LOG.error("ERROR: " + ret.error + "/" + this._tests.length);
        ret.elapsed = stopWatch.elapsed();
        this.LOG.info("Elapsed ms="+ret.elapsed);

        this.LOG.trace("runTests: end");
        return ret;
    };


    ns.TestSuite.prototype.toString = function()
    {
        return "TestSuite{" +
            "_options:" + ns.TestCase.optionsToString(this._options) +
            ", _tests:" + this._tests +
            '}';
    };


    ns.TestSuite.prototype.LOG = ns.TestSuite.LOG = Logger.getLogger("TestSuite");

}(Module("test"),Module("lang"),Module("tools")));

console && console.log("### TestSuite.js end");
