import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  try {
    console.log("Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/');
    
    console.log("Clicking 'First-Time User'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('First-Time User'));
      if (btn) btn.click();
    });

    console.log("Checking if login form loaded...");
    await page.waitForSelector('input[name="area_of_interest"]', { timeout: 10000 });
    console.log("Login page loaded.");
    
    console.log("Filling out login form...");
    await page.type('input[name="name"]', 'Test User');
    await page.type('input[name="employee_id"]', 'EMP_TEST_01');
    await page.type('input[name="area_of_interest"]', 'Cybersecurity');
    
    console.log("Submitting login form...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    
    console.log("Checking Initial Assessment Choice page...");
    // Wait for the button
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Take Initial Assessment')),
      { timeout: 5000 }
    );
    console.log("Found Take Assessment button.");
    
    console.log("Navigating to Take Assessment...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Take Initial Assessment'));
        if (btn) btn.click();
      })
    ]);
    
    console.log("Loading questions...");
    await page.waitForSelector('h3', { timeout: 15000 }); // Wait for questions to render
    
    // Check how many questions loaded
    const qCount = await page.evaluate(() => {
      // Find the element that shows "Question X of Y"
      const text = document.body.innerText;
      const match = text.match(/Question \d+ of (\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    console.log(`Total questions detected: ${qCount}`);
    
    if (qCount === 0) {
      throw new Error("Questions failed to load.");
    }
    
    console.log("Answering all questions...");
    for (let i = 1; i <= qCount; i++) {
      // Wait for the specific question number to be visible
      await page.waitForFunction((num) => {
        return document.body.innerText.includes(`Question ${num} of`);
      }, { timeout: 5000 }, i);
      
      const optionHandles = await page.$$('.flex-col.gap-3 button');
      let clickedOption = false;
      for (const btn of optionHandles) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text) {
          console.log(`Question ${i} clicking option: ${text.substring(0, 20).replace(/\n/g, ' ')}...`);
          await page.evaluate(el => el.click(), btn);
          clickedOption = true;
          break;
        }
      }
      if (!clickedOption) throw new Error(`No option found at question ${i}`);
      
      // Click Next or Submit
      if (i < qCount) {
        let nextClicked = false;
        const btns = await page.$$('button');
        for (const btn of btns) {
          const text = await page.evaluate(el => el.innerText, btn);
          if (text.includes('Next')) {
            await page.evaluate(el => el.click(), btn);
            nextClicked = true;
            break;
          }
        }
        if (!nextClicked) throw new Error(`Next button missing at question ${i}`);
      } else {
        let submitBtnHandle = null;
        const btns = await page.$$('button');
        for (const btn of btns) {
          const text = await page.evaluate(el => el.innerText, btn);
          if (text.includes('Submit Assessment')) {
            submitBtnHandle = btn;
            break;
          }
        }
        
        if (submitBtnHandle) {
          console.log("Submitting assessment...");
          const isSubmitDisabled = await page.evaluate(el => el.disabled, submitBtnHandle);
          console.log("Is Submit button disabled?", isSubmitDisabled);
          
          if (isSubmitDisabled) {
             throw new Error("Submit button is disabled. Answers might be incomplete.");
          }
          
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
            page.evaluate(el => el.click(), submitBtnHandle)
          ]);
        } else {
          throw new Error("Submit button missing on final question.");
        }
      }
    }
    
    console.log("Checking dashboard...");
    await page.waitForSelector('h2', { timeout: 15000 });
    
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes("Area of Interest Profile")) {
      console.log("✅ Area of Interest Profile found!");
    } else {
      console.log("❌ Area of Interest Profile MISSING!");
    }
    
    if (text.includes("Recommended for You")) {
      console.log("✅ Recommendations found!");
    } else {
      console.log("❌ Recommendations MISSING!");
    }
    
    console.log("E2E Test Passed Successfully.");
    
  } catch (err) {
    console.error("TEST FAILED:", err);
    await page.screenshot({ path: 'error_screenshot.png' });
    console.log("Screenshot saved to error_screenshot.png");
  } finally {
    await browser.close();
  }
})();
