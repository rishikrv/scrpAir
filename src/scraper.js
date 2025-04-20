import puppeteer from "puppeteer-core";
import path from "path";

const getPuppeteerExecutablePath = () => {
  // Path to Chromium (adjust based on your setup)
  return "/usr/bin/chromium-browser"; // or '/usr/local/bin/chromium' if different
};

// Function to scrape blocked dates
export const scrapeBlockedDates = async (url) => {
  const browser = await puppeteer.launch({
    executablePath: getPuppeteerExecutablePath(),
    headless: true, // true for headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // You can adjust this part based on the HTML structure of the Airbnb page
  const blockedDates = await page.evaluate(() => {
    const blocked = []; // Array to store blocked dates
    // Example of how you might extract blocked dates (adjust accordingly)
    document.querySelectorAll(".blocked-date").forEach((dateElement) => {
      const date = dateElement.getAttribute("data-date"); // Assume each blocked date has this attribute
      blocked.push(date);
    });
    return blocked;
  });

  await browser.close();
  return blockedDates;
};
