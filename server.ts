"use strict";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Define allowed origins
const allowedOrigins = [
  "https://nex-bank.pages.dev", // Cloudflare Pages frontend
  "http://localhost:4200", // Local dev frontend
  "http://127.0.0.1:8080", // Local dev API (optional)
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-authentication-token"],
    credentials: false, // Set to true if using cookies
  })
);

// Handle preflight requests explicitly
app.options("*", cors()); // Respond to OPTIONS requests for all routes

app.use(bodyParser.json()); // Support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // Support URL-encoded bodies

app.get("/", (req: Request, res: Response) => {
  console.log(req.body);
  console.log("status success");
  res.send("OK");
});

app.get("/api/transactions", (req: Request, res: Response) => {
  const pageRequested = parseInt(req.query.page as string) || 1;
  if (pageRequested === 2) {
    res.send(require("./data/transactions_page2.json"));
  } else if (pageRequested === 3) {
    res.send(require("./data/transactions_page3.json"));
  } else {
    res.send(require("./data/transactions.json"));
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
