console && console.log("### IllegalArgumentException.js begin");

(function(ns)
{
    // Constructor
    ns.IllegalArgumentException = function(msg){
        if (arguments.length !== 1)
        {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        ns.Exception.call(this, ns.IllegalArgumentException.TYPE, msg);
    };

    ns.IllegalArgumentException.prototype = new ns.Exception();

    ns.IllegalArgumentException.TYPE = "IllegalArgument";

}(Module("lang")));

console && console.log("### IllegalArgumentException.js end");
