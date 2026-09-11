const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  
  // Fill login
  await page.waitForSelector('form');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  console.log("Current URL after login:", page.url());
  
  // Wait for the h1 in the new page
  try {
    const text = await page.$eval('h1', el => el.innerText);
    console.log("H1 text on new page:", text);
  } catch(e) {
    console.log("No h1 found or error", e.message);
  }
  
  const content = await page.content();
  console.log("Contains Welcome:", content.includes("Welcome"));
  console.log("Contains Assessment:", content.includes("Assessment"));
  
  await browser.close();
})();
