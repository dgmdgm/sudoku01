console && console.log("### IllegalStateException.js begin");

(function(ns)
{
    // Constructor
    ns.IllegalStateException = function(msg){
        if (arguments.length !== 1)
        {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        ns.Exception.call(this, ns.IllegalStateException.TYPE, msg);
    };

    ns.IllegalStateException.prototype = new ns.Exception();

    ns.IllegalStateException.TYPE = "IllegalState";

}(Module("lang")));

console && console.log("### IllegalStateException.js end");
