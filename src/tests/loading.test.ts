import puppeteer, { Browser, Page } from "puppeteer";

describe("Public navigation", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("navigates to the front page", async () => {
    await page.goto("http://localhost:3001");
    await page.waitForSelector(".welcomeText");

    const text = await page.$eval(".welcomeText", (e) => e.textContent);
    expect(text).toContain("Welcome to Locahub!");
  });

  it("navigates to login page", async () => {
    await page.waitForSelector(".login");
    await page.click(".login");
    await page.waitForSelector(".loginHeading");

    expect(page.url()).toBe('http://localhost:3001/login');
  });

  afterAll(() => browser.close());
});