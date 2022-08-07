const puppeteer = require('puppeteer');

let browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
})

beforeAfter(() => {
    await browser.close()
})

test("Header Test", async () => {

    const text = await page.$eval('a.left.brand-logo', el => el.innerHTML)

    expect(text).toEqual("Blogster")

})

