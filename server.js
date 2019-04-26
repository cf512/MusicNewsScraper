var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var chalk = require("chalk");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local  database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tunesNewsDB";

mongoose.connect(MONGODB_URI);

// Database configuration
var databaseUrl = "tunesNewsDB";
var collections = ["news"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Homepage
app.get("/", function (req, res) {
    // res.send("Hello world");
    db.news.find({}, function(err, data) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }
        else {
          // Otherwise, send the result of this query to the browser
          res.json(data);
        }
      });
});

// Route that scrapes the remote site and sends results to database (and an array)
app.get("/news", function (req, res) {

    // The Scraping
    // =============================================================
    var url = "https://www.digitalmusicnews.com/";
    console.log("visiting " + url);

    axios.get(url).then(function (response) {

        var $ = cheerio.load(response.data);
        var results = [];

        // Grabbing headline
        // =============================================================
        $(".cb-meta").each(function (i, element) {
            var title = $(element).find("h2.cb-post-title").text();
            var author = $(element).find(".cb-author").text();
            var date = $(element).find(".cb-date").text();
            var content = $(element).find(".cb-excerpt").text();
            var link = $(element).find(".cb-excerpt").find("a").attr("href");

            // If this found element had both a title and a link
            if (title && link) {

                // Insert the data in the scrapedData db
                db.news.insert({
                    title: title,
                    author: author,
                    date: date,
                    link: link,
                    content: content
                },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                            // res.json(inserted);
                            // // Push results into the array
                            // results.push({
                            //     title: title,
                            //     author: author,
                            //     date: date,
                            //     link: link,
                            //     content: content
                            // });
                        }
                        // res.send("Scrape Complete");
                    });
            }
        });
    });
})

// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});
