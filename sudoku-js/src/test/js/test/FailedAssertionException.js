console && console.log("### FailedAssertionException.js begin");

(function(ns,lang)
{
    // Constructor
    ns.FailedAssertionException = function(msg){
        if (arguments.length !== 1)
        {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        lang.Exception.call(this, ns.FailedAssertionException.TYPE, msg);
    };

    ns.FailedAssertionException.prototype = new lang.Exception();

    ns.FailedAssertionException.TYPE = "FailedAssertion";

}(Module("test"),Module("lang")));

console && console.log("### FailedAssertionException.js end");
