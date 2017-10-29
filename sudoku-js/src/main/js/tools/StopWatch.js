console && console.log("### StopWatch.js begin");

(function(ns, lang)
{
    // Constructor
    ns.StopWatch = function()
    {
        this._timeStarted = 0;
        this._timeStopped = 0;
    };

    /**
     * Start the timer
     *
     * @return this instance
     */
    //public StopWatch start()
    ns.StopWatch.prototype.start = function()
    {
        if (this._timeStarted !== 0 && this._timeStopped === 0)
        {
            throw new ns.IllegalStateException("Already started");
        }

        this._timeStarted = Date.now();
        return this;
    };

    /**
     * Stops the timer.
     *
     * @return this instance
     */
    //public StopWatch stop()
    ns.StopWatch.prototype.stop = function()
    {
        if (this._timeStarted === 0)
        {
            throw new ns.IllegalStateException("Not started");
        }
        else if (this._timeStopped !== 0)
        {
            throw new ns.IllegalStateException("Already stopped");
        }

        this._timeStopped = Date.now();
        return this;
    };

    /**
     * Returns the elapsed time (ms) since start.
     *
     * @return elapsed time (ms) since start.
     */
    //public long elapsed()
    ns.StopWatch.prototype.elapsed = function()
    {
        if (this._timeStarted === 0)
        {
            return 0;
        }
        else if (this._timeStopped === 0)
        {
            return Date.now() - this._timeStarted;
        }
        else
        {
            return this._timeStopped - this._timeStarted;
        }

    };

    ns.StopWatch.prototype.LOG = ns.StopWatch.LOG = Logger.getLogger("StopWatch ");

}(Module("tools"),Module("lang")));

console && console.log("### StopWatch.js end");


