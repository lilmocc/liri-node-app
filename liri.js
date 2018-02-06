require("dotenv").config();

var Spotify = require("node-spotify-api"); // node package for spotify
var Twitter = require("twitter"); // node packge for twitter
var request = require("request"); // node package for request
var keys = require("./keys.js") // connection to keys.js file
const chalk = require("chalk"); // node package "chalk" for using colored text

var spotifyKeys = new Spotify(keys.spotify);
var twitterKeys = new Twitter(keys.twitter);

var fs = require("fs"); // node package for reading/writing files
var inquirer = require("inquirer"); // node package to use inquirer

// LIRI's first greeting
console.log(chalk.magentaBright.bold("Hello, I'm LIRI!"));

// run the main menu function
mainMenu();

// main menu function
function mainMenu() {
    var message = chalk.magentaBright.bold("What would you like to do? (Choose a number)");
    inquirer
      .prompt([
        {
          type: "rawlist",
          message: message,
          choices: ["Look at bballmocc's tweets", "Look up a song on Spotify", "Look up a movie on IMDB", "Do whatever I say", "Nothing, sorry to bother you LIRI"],
          name: "liriCommand"
        },
    ]).then(function(userChoice) {
        var command = userChoice.liriCommand;
        if (command === "Look at bballmocc's tweets") {
          console.log(chalk.magentaBright("Here are bballmocc's 5 latest tweets:"));
          viewTweets();
        }
        if (command === "Look up a song on Spotify") {
          console.log(chalk.magentaBright("Ok, what song?"));
          searchSpotify();
        }
        if (command === "Look up a movie on IMDB") {
          console.log(chalk.magentaBright("Ok, what movie?"));
          searchMovie();
        }
        if (command === "Do whatever I say") {
          console.log(chalk.magentaBright("Ok here's what I want..."))
          whatLIRIsays();
        }
        if (command === "Nothing, sorry to bother you LIRI") {
          console.log(chalk.magentaBright("That's OK! Let me know if you need anything"))
          return;
        }
    });
};

// twitter function
function viewTweets() {
  var client = twitterKeys;
    client.get("statuses/user_timeline", {screen_name: "bballmocc", count: 20}, function(error, tweet, body) {
        if (!error) {
        for (var i = 1; i < 6; i++) {
          console.log(chalk.cyan("Tweet #") + chalk.cyan(i) + chalk.cyan(": ") + tweet[i].text + chalk.cyan("\nPosted on: ") + tweet[i].created_at + "\n");
        };
        mainMenu();
    }
    else {
      console.log(error);
    };
  });
};

// spotify function
function searchSpotify() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Type a SONG you'd like information for:",
          name: "songQuery"
        },
    ]).then(function(song) {
      var client = spotifyKeys;

      spotifyKeys.search({ type: "track", query: songQuery, limit: 5 }, function(error, data) {
        if (error) {
          return console.log("Error occurred: " + error);
        }
        else {
          var tracks = data.tracks.items[0];
          console.log(chalk.magentaBright("\nHere's the top result:") +
          chalk.cyan("\nArtist: ") + tracks.artists[0].name +
          chalk.cyan("\nSong Name: ") + tracks.name +
          chalk.cyan("\nAlbum: ") + tracks.album.name +
          chalk.cyan("\nPreview: ") + tracks.preview_url +
          "\n");
      mainMenu();
      };
    });
  });
};

// OMDB function
function searchMovie() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Type a MOVIE you'd like information for:",
        name: "movieQuery"
      },
  ]).then(function(movie) {


    if (movie.movieQuery === "") {
      var movieQuery = "Mr Nobody"
    } else {
      var movieQuery = movie.movieQuery;
    }


    request("http://www.omdbapi.com/?t="+movieQuery+"&y=&plot=short&tomatoes=true&apikey=896f9977&r=json", function(error, response, body) {
 		if (!error) {
 		   var json = JSON.parse(body);
       console.log("");
 		   console.log(chalk.cyan("Title: ") + json.Title);
 		   console.log(chalk.cyan("Year: ") + json.Year);
 		   console.log(chalk.cyan("Plot: ") + json.Plot);
       console.log(chalk.cyan("IMDB Rating: ") + json.imdbRating);
       console.log(chalk.cyan("Rotten Tomatoes Rating: ") + json.tomatoRating);
       console.log(chalk.cyan("Country: ") + json.Country);
       console.log(chalk.cyan("Language: ") + json.Language);
 		   console.log(chalk.cyan("Plot: ") + json.Plot);
		   console.log(chalk.cyan("Actors: ") + json.Actors);
		   console.log("");
 		}
    else if (error) {
        return console.log("Error occurred: " + error);
      }
      mainMenu();
    });
 	})
};

// do what LIRI says function (right now defaults to searching for "I Want It That Way")
function whatLIRIsays() {
  fs.readFile("random.txt", "utf8", function(error, data){
  		var text = data.split(",");
      var LIRIsays = text[3];
      console.log(chalk.magentaBright.bold(LIRIsays));
      // function randomCommand() {
      // return Math.floor(Math.random() * Math.floor(4));
      spotifyKeys.search({ type: 'track', query: LIRIsays }, function(error, data) {
        if (error) {
          return console.log('Error occurred: ' + error);
        }
        else {
          var tracks = data.tracks.items[0];
          console.log(chalk.cyan("\nArtist: ") + tracks.artists[0].name +
          chalk.cyan("\nSong Name: ") + tracks.name +
          chalk.cyan("\nAlbum: ") + tracks.album.name +
          chalk.cyan("\nPreview: ") + tracks.preview_url +
          "\n");
        }
      mainMenu();
      });
    // };
  });
};
