console && console.log("### IndexOutOfBoundsException.js begin");

(function(ns)
{
    // Constructor
    ns.IndexOutOfBoundsException = function(msg){
        if (arguments.length !== 1)
        {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        ns.Exception.call(this, ns.IndexOutOfBoundsException.TYPE, msg);
    };

    ns.IndexOutOfBoundsException.prototype = new ns.Exception();

    ns.IndexOutOfBoundsException.TYPE = "IndexOutOfBounds";

}(Module("lang")));

console && console.log("### IndexOutOfBoundsException.js end");
