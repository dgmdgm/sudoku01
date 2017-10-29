console && console.log("### Module.js begin");

// Constructor  and/or function
var Module = function (name) {

    // Validations
    if (arguments.length === 0) {
        throw Error("Missing arguments")
    }
    else if (arguments.length > 1) {
        throw Error("Too many arguments")
    }

    if (this instanceof Module) {
        // Invocation as constructor

        this._name = name;
        if (Module._instances[name]) {
            throw new Error("Name already exists. Try invoking without new.");
        }
        Module._instances[name] = this;
    } else {
        // Invocation as simple function to retrieve or create instances.

        let ret = Module._instances[name];
        // Create the instane if it does not already exist.
        if (!ret) {
            ret = new Module(name);
        }
        return ret;
    }
};


// All created instances
//todo make sure it does not interfere with GC
Module._instances = {};

console && console.log("### Module.js end");
