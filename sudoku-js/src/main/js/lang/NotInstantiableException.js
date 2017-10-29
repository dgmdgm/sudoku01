console && console.log("### NotInstantiableException.js begin");

(function(ns)
{
    // Constructor
    ns.NotInstantiableException = function(msg){
        if (arguments.length !== 1)
        {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        ns.Exception.call(this, ns.NotInstantiableException.TYPE, msg);
    };

    ns.NotInstantiableException.prototype = new ns.Exception();

    ns.NotInstantiableException.TYPE = "NotInstantiable";

}(Module("lang")));

console && console.log("### NotInstantiableException.js end");
