const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const scrapeBlockedDates = require("./scraper");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define the route for scraping blocked dates
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    const blockedDates = await scrapeBlockedDates(url);
    res.json({ success: true, blockedDates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
