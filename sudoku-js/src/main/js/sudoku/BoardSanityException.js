console && console.log("### BoardSanityException.js begin");

(function(ns,lang)
{
    // Constructor
    ns.BoardSanityException = function(msg){
        if (arguments.length !== 1) {
            throw new Error("Wrong number of arguments")
        }
        //superclass
        lang.Exception.call(this, ns.BoardSanityException.TYPE, msg);
    };

    ns.BoardSanityException.prototype = new ns.Exception();

    ns.BoardSanityException.TYPE = "BoardSanity";

}(Module("sudoku"),Module("lang")));

console && console.log("### BoardSanityException.js end");
