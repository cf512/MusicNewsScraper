# MusicNewsScraper
an app that scrapes news articles from DigitalMusicNews.com, stores them in a MongoDB database, and can scrape on-demand for new articles with the click of a button, but doesn't add them if they already exist

## Live Version deployed to Heroku:

https://evening-gorge-92186.herokuapp.com/

### Technical Architecture:

This app uses the Axios & Cheerio npm packages to scrape the remote site by looking for content blocks with the class `".cb-meta"` and then searching within those for the following tags and classes:

```
$(".cb-meta").each(function (i, element) {
    var result = {};
    result.title = $(this).find("h2.cb-post-title").text();
    result.author = $(this).find(".cb-author").text();
    result.date = $(this).find(".cb-date").text();
    result.content = $(this).find(".cb-excerpt").text();
    result.link = $(this).find(".cb-excerpt").find("a").attr("href");
    (...)
```

It takes the findings and stores them within an object called `result`, and then the object gets recorded to a MongoDB database using the Mongoose npm package:

```
    (...)
    db.Post.create(result)
        .then(function (dbArticle) {
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
    });
```

### File Structure:

```
├── ./README.md
├── ./assignment.md
├── ./models
│   ├── ./models/Note.js
│   ├── ./models/Post.js
│   └── ./models/index.js
├── ./package-lock.json
├── ./package.json
├── ./public
│   ├── ./public/app.js
│   ├── ./public/index.html
│   └── ./public/reference.js
└── ./server.js
```

### Original Assignment Notes:

For posterity, the original assignment notes can be found in [assignment.MD](https://github.com/cf512/MusicNewsScraper/blob/master/assignment.MD).