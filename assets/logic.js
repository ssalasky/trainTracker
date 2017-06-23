var config = {
    apiKey: "AIzaSyD5F4mUO86mkrIYBTBUZSLPJuF5fOUfB7A",
    authDomain: "train-tracker-5b7cf.firebaseapp.com",
    databaseURL: "https://train-tracker-5b7cf.firebaseio.com",
    projectId: "train-tracker-5b7cf",
    storageBucket: "",
    messagingSenderId: "89332103154"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#addTrain").on("click", function(event) {
	event.preventDefault();

	name = $("#train-name").val().trim();
	dest = $("#train-dest").val().trim();
	start = moment($("#train-start").val().trim(), "HH:mm").subtract(10, "years").format("X");
	interval = $("#train-int").val().trim();

	var newTrain = {
		trainName: name,
		destination: dest,
		firstTrain: start,
		frequency: interval
	}

	database.ref().push(newTrain);

	// console.log(newTrain.trainName);
	// console.log(newTrain.destination);
	// console.log(newTrain.firstTrain);
	// console.log(newTrain.frequency);

	$("#train-name").val("");
	$("#train-dest").val("");
	$("#train-start").val("");
	$("#train-int").val("");

	return false;

	$("#train-data").html(
		"<table class='table'><tr><th>Train Name</th><th>Destination</th><th>Frequency (min)</th><th>Next Arrival</th><th>Minutes Away</th></tr></table>"
		)
});

database.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {
	var displayName = childSnapshot.val().trainName;
	var displayDest = childSnapshot.val().destination;
	var displayFirst = childSnapshot.val().firstTrain;
	var displayFreq = childSnapshot.val().frequency;

	var timeDiff = moment().diff(moment.unix(displayFirst), "minutes");
	var timeRemain = moment().diff(moment.unix(displayFirst), "minutes") % displayFirst;
	var timeMinutes = displayFreq - timeRemain;

	var nextArrival = moment().add(timeMinutes, "m").format("hh:mm A");
	console.log(timeMinutes);
	console.log(nextArrival);

	console.log(moment().format("X"));

	$("train-data").append("<tr><td>" + displayName +
		"</td><td>" + displayDest +
		"</td><td>" + displayFreq +
		"</td><td>" + nextArrival +
		"</td><td>" + timeMinutes + "</td></tr>")
	
}, function(errorObject) {
	console.log(errorObject.code);
});

console.log(moment().format("DD/MM/YY hh:mm A"));