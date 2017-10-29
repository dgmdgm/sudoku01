console && console.log("### Logger.js begin");

//todo namespace
//todo configurable format
//todo extra args for exceptions

var lang = Module("lang");

// Constructor
let Logger = function(name){
    this._name = name;
    
    this._isTraceOn = true;
    this._isDebugOn = true;
    this._isInfoOn = true;
    this._isWarnOn = true;
    this._isErrorOn = true;
    this._isSevereOn = true;
};

Logger._instances = {};


Logger.getLogger = function(name)
{
    if (typeof name === "function") name = name.name;
    if (typeof name !== "string") throw new lang.IllegalArgumentException("Expecting a class constructor or a string");

    // Reuse or create new
    var ret = Logger._instances[name];
    if (!ret) {
        ret = new Logger(name);
        Logger._instances[name]= ret;
    }
    return ret;
};


Logger.setAllTrace = function(flag)
{
    flag = !!flag; //force boolean
    for (let k in Logger._instances)
    {
        Logger._instances[k]._isTraceOn = flag;
    }
};


Logger.setAllDebug = function(flag)
{
    flag = !!flag; //force boolean
    for (let k in Logger._instances)
    {
        Logger._instances[k]._isDebugOn = flag;
    }
};


Logger.setAllInfo = function(flag)
{
    flag = !!flag; //force boolean
    for (let k in Logger._instances)
    {
        Logger._instances[k]._isInfoOn = flag;
    }
};


//private
Logger.prototype.log = function(f,level,msg){
    //todo validate args

    let s = "";
    // when
    let now = new Date();
    s += now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds() + " ";
    // where
    s += this._name + " " ;
    // what
    s += level + " " + msg;

    f.call(console,s);
};

Logger.prototype.trace= function (msg) {
    if (this._isTraceOn) this.log(console.debug,"TRACE",msg);
};

Logger.prototype.debug = function (msg) {
    if (this._isDebugOn) this.log(console.debug,"DEBUG",msg);
};

Logger.prototype.info = function (msg) {
    if (this._isInfoOn) this.log(console.info,"INFO",msg);
};

Logger.prototype.warn= function (msg) {
    if (this._isWarnOn) this.log(console.warn, "WARN",msg);
};

Logger.prototype.error= function (msg) {
    if (this._isErrorOn) this.log(console.error,"ERROR",msg);
};

Logger.prototype.severe= function (msg) {
    if (this._isSevereOn) this.log(console.error,"SEVERE",msg);
};

console && console.log("### Logger.js end");
