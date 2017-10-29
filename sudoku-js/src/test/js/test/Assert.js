console && console.log("### Assert.js begin");

(function (ns, lang) {
    // Constructor
    ns.Assert = function () {
        throw new lang.NotInstantiableException();
    };

    ns.Assert.prototype.LOG = ns.Assert.LOG = Logger.getLogger("Assert");


    // args should contains n value. If it is smaller, pad it with empty string on the left.
    ns.Assert.fixArgs = function (args, min, max) {
        if (args.length < min || args.length > max) {
            //todo
            throw new Error("Unexpected number of arguments")
        }

        const ret = [];
        const offset = max - args.length;
        for (let k = 0; k < offset; k++) {
            ret[k] = "";
        }
        for (let k = offset; k < max; k++) {
            ret[k] = args[k - offset];
        }
        return ret;
    };


    ns.Assert.fail = function (msg) {
        throw new ns.FailedAssertionException(msg);
    };


    ns.Assert.assertEquals = function () {
        const args =  ns.Assert.fixArgs(arguments, 2, 3);
        const msg = args[0];
        const expected = args[1];
        const actual = args[2];

        if (expected !== actual) {
            let s = "assertEquals expected=" + expected + ", actual=" + actual;
            if (msg != null) s += ", msg=" + msg;
            this.fail(s);
        }
    };


    ns.Assert.assertNotEquals = function () {
        const args =  ns.Assert.fixArgs(arguments, 2, 3);
        const msg = args[0];
        const expected = args[1];
        const actual = args[2];

        if (expected === actual) {
            let s = "assertNotEquals expected=" + expected + ", actual=" + actual;
            if (msg != null) s += ", msg=" + msg;
            this.fail(s);
        }
    };


    ns.Assert.assertFalse = function () {
        const args =  ns.Assert.fixArgs(arguments, 1, 2);
        const msg = args[0];
        const actual = args[1];

        this.assertEquals(msg, false, actual)
    };

    ns.Assert.assertTrue = function () {
        const args =  ns.Assert.fixArgs(arguments, 1, 2);
        const msg = args[0];
        const actual = args[1];

        this.assertEquals(msg, true, actual);
    };


    ns.Assert.assertNull = function () {
        const args =  ns.Assert.fixArgs(arguments, 1, 2);
        const msg = args[0];
        const actual = args[1];

        this.assertEquals(msg, null, actual);
    };


    ns.Assert.assertNotNull = function () {
        const args =  ns.Assert.fixArgs(arguments, 1, 2);
        const msg = args[0];
        const actual = args[1];

        this.assertNotEquals(msg, null, actual);
    };


    ns.Assert.assertUndefined = function () {
        const args =  ns.Assert.fixArgs(arguments, 1, 2);
        const msg = args[0];
        const actual = args[1];

        this.assertEquals("undefined", typeof(actual));
    };


    ns.Assert.assertNotUndefined = function () //(msg, actual)
    {
        this.assertNotEquals("undefined", typeof(actual));
    };

}(Module("test"), Module("lang")));

console && console.log("### Assert.js.js end");
