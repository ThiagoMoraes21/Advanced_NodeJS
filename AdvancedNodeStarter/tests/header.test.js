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
const Page = require('./helpers/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
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



test('When sign in, shows logout button', async() => {
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});