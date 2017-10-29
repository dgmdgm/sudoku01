package com.dmarchesseault.sudoku;

import junit.framework.Assert;
import org.apache.log4j.Logger;
import org.junit.Test;

public class JunkTest
{
    private static final Logger LOG = Logger.getLogger(JunkTest.class);

    @Test
    public void test_1()
    {
        LOG.info(Thread.MIN_PRIORITY);
        LOG.info(Thread.NORM_PRIORITY);
        LOG.info(Thread.MAX_PRIORITY);
    }


}
