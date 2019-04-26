var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var chalk = require("chalk");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();
var db = require("./models");
var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local  database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tunesNewsDB";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Homepage
app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Post.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route that scrapes the remote site and sends results to database (and an array)
app.get("/scrape", function (req, res) {

    // The Scraping
    // =============================================================
    var url = "https://www.digitalmusicnews.com/";
    console.log("visiting " + url);

    axios.get(url).then(function (response) {

        var $ = cheerio.load(response.data);

        // Grabbing headline
        // =============================================================
        $(".cb-meta").each(function (i, element) {

            var result = {};

            result.title = $(this).find("h2.cb-post-title").text();
            result.author = $(this).find(".cb-author").text();
            result.date = $(this).find(".cb-date").text();
            result.content = $(this).find(".cb-excerpt").text();
            result.link = $(this).find(".cb-excerpt").find("a").attr("href");

            // If this found element had both a title and a link
            // if (result.title && result.link) {

            db.Post.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });
// });

// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});
