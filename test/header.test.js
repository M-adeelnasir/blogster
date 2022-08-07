const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory')

let browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
})

// afterEach(async () => {
//     await browser.close()
// })

test("Header Test", async () => {

    const text = await page.$eval('a.left.brand-logo', el => el.innerHTML)
    expect(text).toEqual("Blogster")

})

test("Login In", async () => {
    await page.click('.right a')
    const url = await page.url()
    expect(url).toMatch('/accounts\.google\.com/')
})



//Session 
test.only("Seesion create, Check for the logout button apears", async () => {
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)

    // expect(session).toEqual('eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjJmMDE5MTRlZDFmOTg0NjY2Yzg2NjA4In19')

    await page.setCookie({ name: 'session', value: session })
    await page.setCookie({ name: 'session.sig', value: sig })

    await page.goto('http://localhost:3000')
    await page.waitForSelector('a[href="/auth/logout"]')


    const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)

    expect(logoutText).toEqual('Logout')


})
