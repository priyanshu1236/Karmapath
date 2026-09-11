const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  console.log("Navigating to login...");
  await page.goto('http://localhost:5173/employee/login');
  
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('First-Time User')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForSelector('input[name="name"]');
  // clear inputs first
  await page.evaluate(() => {
    document.querySelector('input[name="name"]').value = '';
    document.querySelector('input[name="employee_id"]').value = '';
    document.querySelector('input[name="area_of_interest"]').value = '';
  });
  await page.type('input[name="name"]', 'Test User');
  await page.type('input[name="employee_id"]', 'EMP_TEST_01');
  await page.type('input[name="area_of_interest"]', 'Cybersecurity');
  
  const regBtns = await page.$$('button');
  for (const btn of regBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Register & Continue')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForSelector('button');
  const dashboardBtns = await page.$$('button');
  for (const btn of dashboardBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Take Initial Assessment')) {
      await btn.click();
      break;
    }
  }
  
  console.log("Waiting for questions to load...");
  await page.waitForSelector('h3', { timeout: 15000 });
  
  const qCount = await page.evaluate(() => {
    const match = document.body.innerText.match(/Question 1 of (\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  console.log(`FRONTEND RENDERED: Question 1 of ${qCount}`);
  
  if (qCount < 21) {
    console.error("FAILED: Expected at least 21 questions.");
    process.exit(1);
  }
  
  console.log("Testing evaluation...");
  let aiCount = 0;
  for (let i = 1; i <= qCount; i++) {
    await page.waitForFunction((num) => {
      return document.body.innerText.includes(`Question ${num} of`);
    }, { timeout: 5000 }, i);
    
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes("Section 2: Your Area of Interest") || text.includes("Personalized questions for")) {
       aiCount++;
    }
    
    const optionHandles = await page.$$('.flex-col.gap-3 button');
    for (const btn of optionHandles) {
      const optText = await page.evaluate(el => el.innerText, btn);
      if (optText) {
        await btn.click();
        break;
      }
    }
    
    if (i < qCount) {
      const nextBtns = await page.$$('button');
      for (const btn of nextBtns) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text === 'Next') {
          await btn.click();
          break;
        }
      }
    } else {
      const subBtns = await page.$$('button');
      for (const btn of subBtns) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text === 'Submit Assessment') {
          await btn.click();
          break;
        }
      }
    }
  }
  
  console.log(`Detected ${aiCount} AI questions visually in the UI.`);
  
  await page.waitForSelector('h1', { timeout: 15000 });
  const dashboardText = await page.evaluate(() => document.body.innerText);
  console.log("Dashboard loaded.");
  if (dashboardText.includes("Cybersecurity")) {
    console.log("Dashboard shows Area of Interest: Cybersecurity");
  } else {
    console.log("Dashboard missing Cybersecurity!");
  }
  
  console.log("Testing Returning User...");
  await page.goto('http://localhost:5173/employee/login');
  
  await page.waitForSelector('button');
  const retBtns = await page.$$('button');
  for (const btn of retBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Returning User')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForSelector('select[name="user_select"]');
  await page.select('select[name="user_select"]', 'EMP002');
  
  const loginBtns = await page.$$('button');
  for (const btn of loginBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.includes('Login')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForSelector('h1', { timeout: 5000 });
  const retDashText = await page.evaluate(() => document.body.innerText);
  if (!retDashText.includes("Take Initial Assessment")) {
    console.log("Returning user flow: PASS (Take Initial Assessment is NOT shown)");
  } else {
    console.log("Returning user flow: FAIL (Take Initial Assessment is shown)");
  }
  
  await browser.close();
})();
