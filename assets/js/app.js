/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, firebase, alert*/

// Create a variable to reference the database.
let db = firebase.database();

// Set elements as jQuery objects
const $trainName = $('#train-name');
const $trainDest = $('#train-dest');
const $trainHr = $('#train-hr');
const $trainMin = $('#train-min');
const $freqHrs = $('#freq-hrs');
const $freqMins = $('#freq-mins');
const $trainBtn = $('#train-btn');

// Declare variables to hold inputs
let trainName = "";
let trainDest = "";
let trainHr = 0;
let trainMin = 0;
let trainPer = 0;
let freqHrs = 0;
let freqMins = 0;

// Submit button click event to get and push user input to firebase database
$trainBtn.on('click', function (e) {
  e.preventDefault();
  // This needs to be assigned in the click event or the default value will get stored
  let $trainPer = $('[name="train-per"]:checked');
  trainName = $trainName.val();
  trainDest = $trainDest.val();
  trainHr = parseInt($trainHr.val());
  trainMin = parseInt($trainMin.val());
  trainPer = parseInt($trainPer.val());
  freqHrs = parseInt($freqHrs.val());
  freqMins = parseInt($freqMins.val());
  console.log(trainName, trainDest, trainHr, trainMin, trainPer, freqHrs, freqMins);
});
