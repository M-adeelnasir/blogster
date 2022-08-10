const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory')
jest.setTimeout(30000)

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

// test("Header Test", async () => {

//     const text = await page.$eval('a.left.brand-logo', el => el.innerHTML)
//     expect(text).toEqual("Blogster")

// })

// test("Login In", async () => {
//     await page.click('.right a')
//     const url = await page.url()
//     expect(url).toMatch('/accounts\.google\.com/')
// })



//Session 
// test("Seesion create, Check for the logout button apears", async () => {
//     const user = await userFactory()
//     const { session, sig } = sessionFactory(user)

//     await page.setCookie({ name: 'session', value: session })
//     await page.setCookie({ name: 'session.sig', value: sig })

//     await page.goto('http://localhost:3000')
//     await page.waitForSelector('a[href="/auth/logout"]')
//     const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)

//     expect(logoutText).toEqual('Logout')


// })



describe("When logged in", () => {
    beforeEach(async () => {
        const user = await userFactory()
        const { session, sig } = sessionFactory(user)

        await page.setCookie({ name: 'session', value: session })
        await page.setCookie({ name: 'session.sig', value: sig })
        await page.goto('http://localhost:3000/blogs')
    })

    test("get the form", async () => {
        await page.waitForSelector('.btn-floating.btn-large.red')
        await page.click('.btn-floating.btn-large.red')
        await page.waitForSelector('.title label')
        const blogTilte = await page.$eval('.title label', el => el.innerHTML)
        expect(blogTilte).toEqual('Blog Title')
    })


    describe("Using Invalid Inputs", () => {
        beforeEach(async () => {
            await page.waitForSelector('.btn-floating.btn-large.red')
            await page.click('.btn-floating.btn-large.red')
            await page.click('form button')
        })

        test("Check for input 1 invalid error", async () => {
            const error_1 = await page.$eval('.title .red-text', el => el.innerHTML)
            expect(error_1).toEqual('You must provide a value')
        })
        test("Check for input 2 invalid error", async () => {

            const error_2 = await page.$eval('.content .red-text', el => el.innerHTML)
            expect(error_2).toEqual('You must provide a value')
        })
    })

    describe("Form Submit", () => {
        beforeEach(async () => {
            await page.waitForSelector('.btn-floating.btn-large.red')
            await page.click('.btn-floating.btn-large.red')
        })

        test("Fill the input Fields", async () => {
            await page.type('.title input', "Test input text for field on", { delay: 20 })
            await page.type('.content input', "Test input text for field on", { delay: 20 })

            await page.click('.teal.btn-flat.right.white-text')
            await page.waitForSelector('h5')
            const confirmation = await page.$eval('h5', el => el.innerHTML)
            expect(confirmation).toEqual('Please confirm your entries')

        })
    })
})