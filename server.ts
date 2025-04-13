"use strict";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "http://127.0.0.1:8081",
  "https://nex-bank.pages.dev/",
  process.env.RENDER_EXTERNAL_URL || "https://your-app.onrender.com", // Add Render URL
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

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
