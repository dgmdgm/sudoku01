console && console.log("### Deque.js begin");


(function(ns)
{
    // Constructor
    ns.Deque = function(){

        this._array = [];

    };


    ns.Deque.prototype.addLast =
        ns.Deque.prototype.add = function(elem) {
        this._array.push(elem);
        return true;
    };


    ns.Deque.prototype.removeLast = function(elem) {
        return this._array.pop(elem);
    };

    ns.Deque.prototype.peekLast = function(elem) {
        return this._array[this._array.length-1];
    };


    ns.Deque.prototype.size = function() {
        return this._array.length;
    };

    ns.Deque.prototype.LOG = ns.Deque.LOG = Logger.getLogger("Deque");

}(Module("util")));

console && console.log("### Deque.js end");
