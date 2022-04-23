import puppeteer, { Browser, Page } from "puppeteer";

describe("Login", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("navigates to the login page", async () => {
    await page.goto("http://localhost:3001");
    await page.waitForSelector(".login");
    await page.click(".login");
    await page.waitForSelector(".loginHeading");
    const text = await page.$eval(".loginHeading", (e) => e.textContent);
    expect(text).toContain("Login");
  });

  it("submitting the login form", async () => {
    await page.goto("http://localhost:3001/login");
    await page.waitForSelector(".loginHeading");

    await page.click(".emailInput");
    await page.type(".emailInput", "test@test.com");

    await page.click(".passwordInput");
    await page.type(".passwordInput", "123456");

    await page.click(".submitButton");

    await page.waitForSelector(".welcomeText");
    
    expect(page.url()).toBe('http://localhost:3001/');
  });

  it("navigates to the settings page", async () => {
    await page.waitForSelector(".settings");
    await page.click(".settings");
    await page.waitForSelector(".settingsHeading");
    expect(page.url()).toBe('http://localhost:3001/settings');
  });

  it("submitting the login form", async () => {
    const firstName = await page.evaluate((e) => e.value, await page.$('.firstNameField'));
    const lastName = await page.evaluate((e) => e.value, await page.$('.lastNameField'));

    await page.click(".firstNameField", {clickCount: firstName.length > 15 ? 3 : 1});  
    await page.type(".firstNameField", "test");

    await page.click(".lastNameField", {clickCount: lastName.length > 15 ? 3 : 1});
    await page.type(".lastNameField", "test");

    await page.click(".submitButton");

    await page.waitForNetworkIdle();
    await page.reload();
    await page.waitForNetworkIdle();
    
    const firstNameNew = await page.evaluate((e) => e.value, await page.$('.firstNameField'));
    const lastNameNew = await page.evaluate((e) => e.value, await page.$('.lastNameField'));

    expect(firstNameNew).toBe((firstName.length > 15 ? '' : firstName) + 'test');
    expect(lastNameNew).toBe((lastName.length > 15 ? '' : lastName) + 'test');
  });

  it("Logout", async () => {
    await page.waitForSelector(".logoutButton");

    await page.click(".logoutButton");

    await page.waitForSelector(".welcomeText");
    expect(page.url()).toBe('http://localhost:3001/');

    const loginButton = await page.$('.login')
    expect(loginButton).not.toBeNull();
  });

  afterAll(() => browser.close());
});