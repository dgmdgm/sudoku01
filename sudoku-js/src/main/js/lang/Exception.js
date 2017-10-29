console && console.log("### Exception.js begin");

//todo try extending from Error
//todo sort out handling of namespace for common

(function(ns)
{

    // Constructor
    ns.Exception = function(type, msg){

        //superclass
        //todo Inheriting from Error does not let us access the message nor the stack, so it is pretty useless.
        //Error.call(this, msg);

        if (arguments.length > 2)
        {
            throw new Error("Wrong number of arguments");
        }

        // For some reason, we cannot access the message in Error so we store our own.
        this._type = type || "unkonwn";
        this._msg = msg;

        //Tweak the stack string to change the error name and the remove the extra frame.
        //todo Make more portable.
        let stack = (new Error()).stack;
        this._stack = this._type + " Exception " + stack.substr(stack.indexOf("\n    at", stack.indexOf("\n    at")+8));

    };


    /**
     * Tests whether the given exception is of the given type.
     *
     * @param e exception
     * @param type exception type
     * @returns {boolean} true iif e is of the given type
     */
    ns.Exception.isType = function(e,type)
    {
        return e instanceof ns.Exception && e._type === type;
    };

    //https://www.nczonline.net/blog/2009/03/10/the-art-of-throwing-javascript-errors-part-2/
    //http://www.javascriptkit.com/javatutors/trycatch2.shtml
    //Exception.prototype = new Error();
    //delete Exception.prototype.stack; // We don't need the prototype one.

    ns.Exception.prototype.getType = function()
    {
        return this._type;
    };


    ns.Exception.prototype.getMsg = function()
    {
        //return this._msg;
        return this._msg;
    };


    ns.Exception.prototype.getStack = function()
    {
        return this._stack;
    };


    ns.Exception.prototype.toString = function()
    {
        var ret = "[Exception";
        if (this._type) ret += ", type="+this._type;
        if (this._where) ret += ", where="+this._where;
        if (this._msg) ret += ", msg="+this._msg;
        if (this._stack) ret += ", stack="+this._stack;
        ret  += "]";
        return ret;
    };

}(Module("lang")));

//todo fix ugly patch
// Expose Exception in other namespace
Module("sudoku").Exception = Module("lang").Exception;

console && console.log("### Exception.js end");
