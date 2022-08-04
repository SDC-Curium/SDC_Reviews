/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const path = require("path");
const controllers = require("./controllers");

const app = express();

// TODO: add app-wide middleware if needed

// const router = require("./routes");
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));

// TODO: define routes
app.get("/reviews", controllers.getReview);
app.get("/reviews/meta", controllers.getMeta);
app.post("/reviews", controllers.postReview);
app.put("/reviews/:review_id/helpful", controllers.putHelpful);
app.put("/reviews/:review_id/report", controllers.putReport);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log("Server listening at http://localhost:3000");
