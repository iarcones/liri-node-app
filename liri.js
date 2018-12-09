require("dotenv").config();


var request = require('request');
var moment = require("moment");


//spotify config
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});



//// PREPARARING INPUT

var input = process.argv;
var command = process.argv[2];
var keyQuery = ""
for (i = 3; i < input.length; i++) {

    keyQuery = keyQuery.concat(input[i] + " ");
}
keyQuery = keyQuery.trim();

console.log("*******************");
console.log(keyQuery);
console.log("*******************");
console.log("****** test31 ******");
console.log("*******************");
console.log("*******************");

////// COMMANDS 

switch (command) {
    case "concert-this":
        bandQuery(keyQuery);
        break;
    case "spotify-this-song":
        sportifyQuery(keyQuery)
        break;
    case "movie-this":
        movieQuery(keyQuery)
        break;
    case "do-what-it-says":
        whatever(keyQuery)
        break;
    default:
        console.log("please tell me what you want");
}

function bandQuery(keyQuery) {

    var query = "https://rest.bandsintown.com/artists/" + keyQuery + "/events?app_id=codingbootcamp"

    request(query, function (error, response, data) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //  console.log(data); // Print the HTML for the Google homepage.
      
        var events = JSON.parse(data);
        console.log(events);
    });

    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
}


function sportifyQuery(keyQuery) {

    spotify.search({
        type: 'track',
        query: keyQuery,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log('The song has not been found, enjoy this one');
            keyQuery = "Ace of Base  The Sign"
            sportifyQuery(keyQuery);
            return;
        }

        var artistsName = "";

        for (i = 0; i < data.tracks.items[0].artists.length; i++) {
            artistsName = artistsName.concat('"' + data.tracks.items[0].artists[i].name + '" ');
        }

        console.log("artists name is: " + artistsName);
        console.log("song name is: " + data.tracks.items[0].name);
        console.log("preview_url: " + data.tracks.items[0].preview_url);
        console.log("album name is: " + data.tracks.items[0].album.name);

    });

}

function movieQuery(keyQuery) {

    var query = "http://www.omdbapi.com/?t=" + keyQuery + "&type=movie&&apikey=trilogy"

    request(query, function (error, response, data) {

        // if (!error && response.statusCode) {

            // console.log('error:', error);
            // keyQuery = "Mr.+Nobody.";
            // console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/ It's on Netflix!");
            // movieQuery(keyQuery);
            // return;
        // }
        // else {
            var movie = JSON.parse(data);

            console.log(movie)
            console.log("* Title of the movie: " + movie.Title);
            console.log("* Year the movie came out: " + movie.Year);
            console.log("* IMDB Rating of the movie: " + movie.imdbRating);
            console.log("* Rotten Tomatoes Rating of the movie: PENDIENTE");
            console.log("* Country where the movie was produced: " + movie.Country);
            console.log("* Language of the movie: " + movie.Language);
            console.log("* Plot of the movie: " + movie.Plot);
            console.log("* Actors in the movie: " + movie.Actors);
            })

    };


