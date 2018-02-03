require("dotenv").config();

var Spotify = require("node-spotify-api"); // node package for spotify
var Twitter = require("twitter"); // node packge for twitter
var request = require("request");
var keys = require("./keys.js") // connection to keys.js file
// var spotifyKeys = keys.spotify;
// var twitterKeys = keys.twitter;

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var fs = require("fs"); // node package for reading/writing files
var inquirer = require("inquirer"); // node package to use inquirer


// ew Spotify(keys.spotify);
// var twitterKeys = new Twitter(keys.twitter);

// console.log(spotifyKeys, twitterKeys);

inquirer
  .prompt([
    {
      type: "rawlist",
      message: "Hi, I'm LIRI. What would you like to do?",
      choices: ["Look at bballmocc's tweets", "Look up a song on Spotify", "Look up a movie on IMDB", "Do whatever I say"],
      name: "liriCommand"
    },
  // After the prompt, store the user's response in a variable called location.
]).then(function(userChoice) {
    var command = userChoice.liriCommand;
    if (command === "Look at bballmocc's tweets") {
      console.log("Look at bballmocc's tweets");
      viewTweets();
    }

    if (command === "Look up a song on Spotify") {
      console.log("Look up a song on Spotify");
      searchSpotify();
    }

    if (command === "Look up a movie on IMDB") {
      console.log("Look up a movie on IMDB");
      searchMovie();
    }

    if (command === "Do whatever I say") {
      console.log("Do whatever I say")
      whatLIRIsays();
    }
});


function viewTweets() {
  var client = twitterKeys;
  // console.log(client);
  var params = {screen_name: "bballmocc"};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log("THIS WORKED");
    }
  });
};


function searchSpotify() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Type a SONG you'd like information for:",
        name: "songQuery"
      },
  ]).then(function(song) {
    var songQuery = song.songQuery;
    // console.log(songQuery);

    spotify.search({ type: 'track', query: songQuery }, function(error, data) {
      if (error) {
        return console.log('Error occurred: ' + error);
      }
      else {
        console.log("song results go here");
      }
  });
});
}


function searchMovie() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Type a MOVIE you'd like information for:",
        name: "movieQuery"
      },
  ]).then(function(movie) {
    var movieQuery = movie.movieQuery;

    request('http://www.omdbapi.com/?t='+movieQuery+'&y=&plot=short&tomatoes=true&apikey=896f9977&r=json', function(error, response, body) {
 		if (!error) {
 		   var json = JSON.parse(body);
 		   console.log("Title: " + json.Title);
 		   console.log("Year: " + json.Year);
 		   console.log("Plot: " + json.Plot);
       console.log("Title: " + json.Title);
 		   console.log("Year: " + json.Year);
       console.log("IMDB Rating: " + json.imdbRating);
       console.log("Rotten Tomatoes rating: " + json.tomatoRating);
       console.log("Country: " + json.Country);
       console.log("Language: " + json.Language);
 		   console.log("Plot: " + json.Plot);
		   console.log("Actors: " + json.Actors);
		   console.log("\n");
 		}
 	})

});
}


function whatLIRIsays() {
  fs.readFile("random.txt", 'utf8', function(error, data){
		if (error) throw err;

		var text = data.split(',');
		var LIRIsays = text[1];
    console.log(LIRIsays);

        spotify.search({ type: 'track', query: LIRIsays }, function(error, data) {
          if (error) {
            return console.log('Error occurred: ' + error);
          }
          else {
            console.log("song results go here x2");
          }
      });
    });

}
