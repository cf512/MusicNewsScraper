var axios = require("axios");
var cheerio = require("cheerio");
var chalk = require("chalk");

var url = "https://www.digitalmusicnews.com/";
console.log("visiting " + url);

axios.get(url).then(function(response){

    var $ = cheerio.load(response.data);
    var results = [];
    
// Grabbing headline
// =============================================================
    $("h2.cb-post-title").each(function(i,element){
        var title = $(element).text();

        results.push({
            title: title,

        })
    });

// Grabbing author and date
// =============================================================

    $("div.cb-byline").each(function(i,element){
        var content = $(element).text();
        var author = $(element).find(".cb-author").text();
        var date = $(element).find(".cb-date").text();

        // console.log("");
        // console.log(chalk.red(content));
        // console.log(chalk.green(author));
        // console.log(chalk.yellow(date));
        // console.log("");

        results.push({
            author: author,
            date: date
        })
    });

// Grabbing article excerpt
// =============================================================
    $("div.cb-excerpt").each(function(i,element){
        var content = $(element).text();
        var link = $(element).find("a").attr("href");

        // console.log("");
        // console.log(chalk.green(content));
        // console.log(chalk.red(link));
        // console.log("");

        results.push({
            content: content,
            link: link
        })
    });
    console.log(results);
});