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

test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => {
        return el.innerHTML;
    });

    expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async() => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});


/*
    Faking a cookie session to make authenticated requests
    1. Create a page instance
    2. Take an existing user ID and genarete a fake session object with it
    3. Sign the session object with keygrip
    4. Set the session and signature on our page instance as cookies
*/
test('When sign in, shows logout button', async() => {
    const id = "5f08997c84feda0517a14483";

    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000'); // refresh page after set cookie session
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});