require("dotenv").config();

var fs = require('fs');
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

var defaultMovie = false;

actions(command, keyQuery);


function actions(command, keyQuery) {

    logData("----" + command + ": " + keyQuery + '\r\n');
    console.log("------------------------------------");

    switch (command) {
        case "concert-this":
            bandQuery(keyQuery);
            break;
        case "spotify-this-song":
            if (keyQuery === "") { keyQuery = "Ace of Base The Sign" }
            spotifyQuery(keyQuery)
            break;
        case "movie-this":
            if (keyQuery === "") { keyQuery = "Mr.+Nobody"; defaultMovie = true}
            movieQuery(keyQuery)
            break;
        case "do-what-it-says":
            randomQuery(keyQuery)
            break;
        default:
            console.log("please tell me what you want");
    }
}

function bandQuery(keyQuery) {

    var query = "https://rest.bandsintown.com/artists/" + keyQuery + "/events?app_id=codingbootcamp"

    request(query, function (error, response, data) {

        if (!error && response.statusCode === 200) {

            var events = JSON.parse(data);

            for (i = 0; i < events.length; i++) {

                textLog = "Name of the venue: " + events[i].venue.name + '\r\n' + "Venue location: " + events[i].venue.city + " (" + events[i].venue.country + ")" + '\r\n' + "Date of the Event: " + moment(events[i].datetime).format("MM/DD/YYYY") + "\r\n\r\n";

                console.log(textLog);
                logData(textLog);
            }
        } else {
            console.log('The artist / band has not been found');
        }
    });
}


function spotifyQuery(keyQuery) {

    spotify.search({
        type: 'track',
        query: keyQuery,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log('The song has not been found');
            return;
        }

        var artistsName = "";

        for (i = 0; i < data.tracks.items[0].artists.length; i++) {
            artistsName = artistsName.concat('"' + data.tracks.items[0].artists[i].name + '" ');
        }

        textLog = "artists name is: " + artistsName + '\r\n' + "song name is: " + data.tracks.items[0].name + '\r\n' + "preview_url: " + data.tracks.items[0].preview_url + '\r\n' + "album name is: " + data.tracks.items[0].album.name + "\r\n\r\n";

        console.log(textLog);
        logData(textLog);

    });

}

function movieQuery(keyQuery) {

    var query = "http://www.omdbapi.com/?t=" + keyQuery + "&type=movie&&apikey=trilogy"

    request(query, function (error, response, data) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(data);
            var rottemValue = "no info";

            if (movie.Ratings) {

                for (i = 0; i < movie.Ratings.length; i++) {
                    if (movie.Ratings[i].Source === 'Rotten Tomatoes') {
                        rottemValue = movie.Ratings[i].Value;
                    }
                }
            }

            if (defaultMovie){
                textLog = "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" + "\r\n" + "It's on Netflix!" + "\r\n\r\n" 
            }
            else{
                textLog = "";
            }
    
            defaultMovie = false;

            textLog = textLog.concat("* Title of the movie: " + movie.Title + '\r\n' + "* Year the movie came out: " + movie.Year + '\r\n' + "* IMDB Rating of the movie: " + movie.imdbRating + '\r\n' + "* Rotten Tomatoes Rating of the movie: " + rottemValue + '\r\n' + "* Country where the movie was produced: " + movie.Country + '\r\n' + "* Language of the movie: " + movie.Language + '\r\n' + "* Plot of the movie: " + movie.Plot + '\r\n' + "* Actors in the movie: " + movie.Actors + "\r\n\r\n")
            
            console.log(textLog);
            logData(textLog);

        } else {
            console.log(error)
        }
    })
};

function randomQuery(keyQuery) {

    fs.readFile('random.txt', 'utf8', function (err, contents) {

        line = contents.split(",");
        actions(line[0], line[1]);

    });
}

function logData(text) {
    fs.appendFile('log.txt', text, 'utf8', function (err) {
        return;
    })
}

