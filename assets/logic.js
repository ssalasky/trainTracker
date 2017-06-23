//initializing firebase backend
var config = {
    apiKey: "AIzaSyD5F4mUO86mkrIYBTBUZSLPJuF5fOUfB7A",
    authDomain: "train-tracker-5b7cf.firebaseapp.com",
    databaseURL: "https://train-tracker-5b7cf.firebaseio.com",
    projectId: "train-tracker-5b7cf",
    storageBucket: "",
    messagingSenderId: "89332103154"
  };
  firebase.initializeApp(config);

// setting up the database as a variable to manipulate
var database = firebase.database();

//creating on "click" event to allow user to add new trains
$("#addTrain").on("click", function(event) {
	//stops page from refreshing every time the submit button is pressed
	event.preventDefault();

	//saving input values as variables
	//converting time of first train into unix time in order to calculate 
	//differences easily
	name = $("#train-name").val().trim();
	dest = $("#train-dest").val().trim();
	start = moment($("#train-start").val().trim(), "HH:mm").subtract(10, "years").format("X");
	interval = $("#train-int").val().trim();

	//storing previous values as an object to be passed to database
	var newTrain = {
		trainName: name,
		destination: dest,
		firstTrain: start,
		frequency: interval
	}

	//console.log(newTrain);

	//storing object to the back-end database
	database.ref().push(newTrain);

	//clearing input fields on submit so user does not have to manually delete
	$("#train-name").val("");
	$("#train-dest").val("");
	$("#train-start").val("");
	$("#train-int").val("");

	//exiting the function
	return false;

});

//creating an event listener to generate data to the page and process calculations
//every time a new object is added to database the following events will trigger
database.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {
	//creating temp variables based on each new child
	var displayName = childSnapshot.val().trainName;
	var displayDest = childSnapshot.val().destination;
	var displayFreq = childSnapshot.val().frequency;
	var displayFirst = childSnapshot.val().firstTrain;
	
	//calculating time differences
	var timeDiff = moment().diff(moment.unix(displayFirst), "minutes");
	var timeRemain = moment().diff(moment.unix(displayFirst), "minutes") % displayFreq;
	var timeMinutes = displayFreq - timeRemain;

	//determining when the next train will arrive and displaying in minutes
	var nextArrival = moment().add(timeMinutes, "m").format("hh:mm A");
	// console.log(timeMinutes);
	// console.log(nextArrival);

	// console.log(moment().format("X"));

	//adding each new train to the page
	$("#train-table").append("<tr><td>" + displayName +
		"</td><td>" + displayDest +
		"</td><td>" + displayFreq +
		"</td><td>" + nextArrival +
		"</td><td>" + timeMinutes + "</td></tr>")

}, function(errorObject) {
	console.log(errorObject.code);
});
