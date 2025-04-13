"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:4200",
    "http://127.0.0.1:8081",
    process.env.RENDER_EXTERNAL_URL || "https://your-app.onrender.com", // Add Render URL
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
}));
app.use(body_parser_1.default.json()); // Support JSON-encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: false })); // Support URL-encoded bodies
app.get("/", (req, res) => {
    console.log(req.body);
    console.log("status success");
    res.send("OK");
});
app.get("/api/transactions", (req, res) => {
    const pageRequested = parseInt(req.query.page) || 1;
    if (pageRequested === 2) {
        res.send(require("./data/transactions_page2.json"));
    }
    else if (pageRequested === 3) {
        res.send(require("./data/transactions_page3.json"));
    }
    else {
        res.send(require("./data/transactions.json"));
    }
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Express app listening on port ${port}!`);
});
