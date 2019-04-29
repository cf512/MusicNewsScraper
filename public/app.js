// =============================================================
// Loads results onto the page
// =============================================================
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current notes
  $.getJSON("/articles", function (data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      $("#results").prepend("<p class='data-entry' data-id=" +
          data[i]._id + "><span class='dataTitle' data-id=" +
          data[i]._id + ">" + data[i].date + "<br><span id='title'>" + data[i].title +
          "</span><br>by " + data[i].author + " </span><br><span>(" +
          "<a href=" + data[i].link + " target=_blank>" + "go to external article)" + "</span></p>");
    }
  });
}

// ==============================================================
// Runs the getResults function as soon as the script is executed
// ==============================================================
getResults();

// =============================================================
// When the #scrape button is clicked, call the /scrape route
// =============================================================
$(document).on("click", "#scrape", function() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/scrape",
  })
  // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function() {
        console.log("Supposed to reload homepage at this point.")
    });
  location.reload();
});