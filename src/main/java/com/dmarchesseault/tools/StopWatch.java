package com.dmarchesseault.tools;

public class StopWatch
{
//    private boolean _started = false;
    private long _timeStarted;
    private long _timeStopped;

    /**
     * Start the timer
     *
     * @return this instance
     */
    public StopWatch start()
    {
        if (_timeStarted != 0 && _timeStopped == 0)
        {
            throw new IllegalStateException("Already started");
        }

        _timeStarted = System.currentTimeMillis();
        return this;
    }

    /**
     * Stops the timer.
     *
     * @return this instance
     */
    public StopWatch stop()
    {
        if (_timeStarted == 0)
        {
            throw new IllegalStateException("Not started");
        }
        else if (_timeStopped != 0)
        {
            throw new IllegalStateException("Already stopped");
        }

        _timeStopped = System.currentTimeMillis();
        return this;
    }

    /**
     * Returns the elapsed time (ms) since start.
     *
     * @return elapsed time (ms) since start.
     */
    public long elapsed()
    {
        if (_timeStarted == 0)
        {
            return 0;
        }
        else if (_timeStopped == 0)
        {
            return System.currentTimeMillis() - _timeStarted;
        }
        else
        {
            return _timeStopped - _timeStarted;
        }

    }


}
