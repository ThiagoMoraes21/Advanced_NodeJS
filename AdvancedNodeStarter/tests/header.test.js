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
let page, browser;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('We can launch a browser', async () => {
    const text = await page.$eval('a.brand-logo', el => {
        return el.innerHTML;
    });

    expect(text).toEqual('Blogster');
});