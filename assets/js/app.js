/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, firebase, alert*/

// Create a variable to reference the database.
let db = firebase.database();

// Set elements as jQuery objects
const $trainName = $('#train-name');
const $trainDest = $('#train-dest');
const $trainHr = $('#train-hr');
const $trainMin = $('#train-min');
const $trainAm = $('#train-am');
const $trainPm = $('#train-pm');
const $freqHrs = $('#freq-hrs');
const $freqMins = $('#freq-mins');
const $trainBtn = $('#train-btn');

const editImg = "assets/img/edit.svg";
const delImg = "assets/img/trash.svg";

// Declare variables to hold input values
let trainName = "";
let trainDest = "";
let trainHr = 0;
let trainMin = 0;
let trainPer = 0;
let freqHrs = 0;
let freqMins = 0;

// Declare variables for input field defaults
let trainHrDef = "6";
let trainMinDef = "0";
let freqHrsDef = "1";
let freqMinsDef = "0";

// Submit button click event to get and push user input to firebase database
$trainBtn.on('click', function (e) {
  e.preventDefault();
  // This needs to be assigned in the click event or the default value will get stored
  let $trainPer = $('[name="train-per"]:checked');
  trainName = $trainName.val().trim();
  trainDest = $trainDest.val().trim();
  trainHr = parseInt($trainHr.val());
  trainMin = parseInt($trainMin.val());
  trainPer = parseInt($trainPer.val());
  freqHrs = parseInt($freqHrs.val());
  freqMins = parseInt($freqMins.val());
  
  // Push user input for train into database
  db.ref().push({
    trainName: trainName,
    trainDest: trainDest,
    trainHr: trainHr,
    trainMin: trainMin,
    trainPer: trainPer,
    freqHrs: freqHrs,
    freqMins: freqMins,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  // Call function to clear form
  resetForm();
});

// Event to retrieve firebase train data to populate table
db.ref().orderByChild('timestamp').on('child_added', function (snapshot) {
  // Call createHtml function
  createHtml(snapshot);
// Error handler
}, function (errorObj) {
  console.log("Error handled: " + errorObj.code);
});

// Function to create and append table row with firebase train data
let createHtml = function (snapshot) {
  let key = snapshot.key;
  let data = snapshot.val();
  let html;
  html = 
    `<tr id="${key}">
      <td>${data.trainName}</td>
      <td>${data.trainDest}</td>
      <td>${data.freqHrs} hrs ${data.freqMins} mins</td>
      <td>6:00 PM</td>
      <td>0 hr 30 min</td>
      <td>
        <img src="${editImg}" alt="">
        <img src="${delImg}" alt="">
      </td>
    </tr>`;
  $('tbody').append(html);
  console.log(key, data.trainName, data.trainDest, data.trainHr);
};

// Function to clear or set to default the form's input fields
let resetForm = function () {
  $trainName.val("");
  $trainDest.val("");
  $trainHr.val(trainHrDef);
  $trainMin.val(trainMinDef);
  $trainAm.prop('checked', true);
  $trainPm.prop('checked', false);
  $freqHrs.val(freqHrsDef);
  $freqMins.val(freqMinsDef);
};

