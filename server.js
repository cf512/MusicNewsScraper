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
    $(".cb-meta").each(function(i,element){
        var title = $(element).find("h2.cb-post-title").text();
        var author = $(element).find(".cb-author").text();
        var date = $(element).find(".cb-date").text();
        var content = $(element).find(".cb-excerpt").text();
        var link = $(element).find(".cb-excerpt").find("a").attr("href");

        results.push({
            title: title,
            author: author,
            date: date,
            // content: content,
            link: link
        });
    });
    console.table(
        results
    );
});