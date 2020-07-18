/*
    **********************
        TEST WORKFLOW
    **********************

    repeat: {
        1: 'Launch Chromium',
        2: 'Navigate to app',
        3: 'Click on stuff on screen',
        4: 'Use a DOM selector to retrieve the content of an element',
        5: 'Write assertion to make sure content is correct'
    }
*/


/* 
    We use puppeteer to create browsers
    and use browsers to create pages. 
*/
const puppeteer = require('puppeteer');

test('We can launch a browser', async () => {
    const browser = await puppeteer.launch({ 
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('localhost:3000');

    const text = await page.$eval('a.brand-logo', el => {
        return el.innerHTML;
    });

    expect(text).toEqual('Blogster');
});