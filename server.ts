"use strict";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();

// CORS middleware from the provided code
const allowCors = (fn: (req: Request, res: Response) => void) => async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Optionally, you can restrict to specific origins like this:
  // const allowedOrigins = [
  //   "https://nex-bank.pages.dev",
  //   "http://localhost:4200",
  //   "http://127.0.0.1:8080",
  // ];
  // res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : false);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-authentication-token"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Apply CORS to all routes by wrapping handlers
app.use(bodyParser.json()); // Support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // Support URL-encoded bodies

app.get(
  "/",
  allowCors((req: Request, res: Response) => {
    console.log(req.body);
    console.log("status success");
    res.send("OK");
  })
);

app.get(
  "/api/transactions",
  allowCors((req: Request, res: Response) => {
    const pageRequested = parseInt(req.query.page as string) || 1;
    if (pageRequested === 2) {
      res.send(require("./data/transactions_page2.json"));
    } else if (pageRequested === 3) {
      res.send(require("./data/transactions_page3.json"));
    } else {
      res.send(require("./data/transactions.json"));
    }
  })
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});
