import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { scrapeBlockedDates } from "./scraper.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to scrape blocked dates
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    // Call scraper to get blocked dates
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
