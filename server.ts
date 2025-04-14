"use strict";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();

// CORS middleware
const allowCors = (fn: (req: Request, res: Response) => void) => async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "https://nex-bank.pages.dev"); // Restrict to your frontend
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Authentication-Token"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get(
  "/",
  allowCors((req: Request, res: Response) => {
    console.log("status success");
    res.send("OK");
  })
);

app.get(
  "/api/transactions",
  allowCors((req: Request, res: Response) => {
    const pageRequested = parseInt(req.query.page as string) || 1;
    let filePath: string;

    // Resolve file paths relative to the dist/ directory
    if (pageRequested === 2) {
      filePath = path.join(__dirname, "data", "transactions_page2.json");
    } else if (pageRequested === 3) {
      filePath = path.join(__dirname, "data", "transactions_page3.json");
    } else {
      filePath = path.join(__dirname, "data", "transactions.json");
    }

    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.send(data);
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      res.status(500).send("Error loading transactions");
    }
  })
);

// Global error-handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(`Error on ${req.method} ${req.url}:`, err.stack);
  res.status(500).send("Internal Server Error");
});

// Export the app for Vercel
module.exports = app;
