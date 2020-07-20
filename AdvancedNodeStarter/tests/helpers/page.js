const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        /* 
            We use puppeteer to create browsers
            and use browsers to create pages. 
        */
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property) {   
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    /*
        Faking a cookie session to make authenticated requests
        1. Create a page instance
        2. Take an existing user ID and genarete a fake session object with it
        3. Sign the session object with keygrip
        4. Set the session and signature on our page instance as cookies
    */
    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);
    
        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('localhost:3000/blogs'); // refresh page after set cookie session
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage;
