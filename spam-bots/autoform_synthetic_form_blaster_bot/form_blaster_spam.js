// AUTOFORM SPAM BOT - HEADLESS FORM INJECTION SCRIPT
// WARNING: Flagged as BOT SPAM in Observatory Repository
// Spam Score: 98/100 | Target: Contact Forms, Support Tickets

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const SPAM_MESSAGE = "Boost your website traffic by 500% with our automated AI tool! Visit http://spam-tracker-link.xyz";

async function blastForm(targetUrl) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  console.log(`[BOT-SPAM-ACTIVE] Blasting form on: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  // Locate input fields and bypass honeypot
  await page.evaluate((msg) => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(t => t.value = msg);
    
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(i => i.value = "contact-lead@synthetic-spam.com");

    const submitBtns = document.querySelectorAll('button[type="submit"], input[type="submit"]');
    if (submitBtns.length > 0) {
      submitBtns[0].click();
    }
  }, SPAM_MESSAGE);

  await browser.close();
}
module.exports = { blastForm };
