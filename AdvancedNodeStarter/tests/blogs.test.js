const Page = require('./helpers/page');
let page;

beforeEach(async() => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async() => {
    await page.close();
});



describe('When logged in', async() => {
    beforeEach(async() => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Can see blog create form', async() => { 
        const url = await page.url();
        const label = await page.getContentsOf('form label');
    
        expect(url).toMatch(/blogs\/new/);
        expect(label).toEqual('Blog Title');
    });
});