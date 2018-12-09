require("dotenv").config();

//spotify config
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});



//// PREPARARIN INPUT

var input = process.argv;
var command = process.argv[2];
var query = ""
for (i = 3; i < input.length; i++) {

    query = query.concat(input[i] + " ");
}
query = query.trim();

console.log("*******************");
console.log("*******************");
console.log("****** test11 ******");
console.log("*******************");
console.log("*******************");

////// COMMANDS 

switch (command) {
    case "concert-this":
        bandQuery(query);
        break;
    case "spotify-this-song":
    sportifyQuery(query)
        break;
    case "movie-this":
    movieQuery(query)
        break;
    case "do-what-it-says":
    whatever(query)
        break;
    default:
        console.log("please tell me what you want");
}

function sportifyQuery(query) {

    spotify.search({
        type: 'track',
        query: query,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log('The song has not been found, enjoy this one');
            query = "Ace of Base  The Sign"
            sportifyQuery(query);
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