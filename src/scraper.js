const puppeteer = require("puppeteer");

async function scrapeBlockedDates(url) {
  const browser = await puppeteer.launch({
    headless: true, // Set to false if you want to see the browser
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    // Go to the provided Airbnb URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for the calendar to load by targeting a known element
    await page.waitForSelector(".calendar");

    // Wait for a few seconds for the page to load completely
    await page.waitForTimeout(5000); // waits for 5 seconds

    // Example: Scrape blocked dates
    const blockedDates = await page.evaluate(() => {
      const dates = [];
      const elements = document.querySelectorAll(".blocked-date"); // Modify this according to the page structure

      elements.forEach((element) => {
        dates.push(element.getAttribute("data-date")); // Modify this depending on the data you need
      });

      return dates;
    });

    return blockedDates;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error("Failed to scrape the Airbnb page");
  } finally {
    await browser.close();
  }
}

module.exports = scrapeBlockedDates;
