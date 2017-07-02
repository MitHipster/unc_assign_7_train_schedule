/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, firebase, alert*/

// Create a variable to reference the database.
let db = firebase.database();

// Set elements as jQuery objects
const $tableBody = $('tbody');
const $trainName = $('#train-name');
const $trainDest = $('#train-dest');
const $trainHr = $('#train-hr');
const $trainMin = $('#train-min');
const $trainAm = $('#train-am');
const $trainPm = $('#train-pm');
const $freqHrs = $('#freq-hrs');
const $freqMins = $('#freq-mins');
const $trainAddBtn = $('#train-add-btn');
const $trainEditBtn = $('#train-edit-btn');
const $trainCancelBtn = $('#train-cancel-btn');

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

// Declare variable to hold whether or not Edit button is hidden
let isEditBtn = false;

// Submit button click event to get and push user input to firebase database
$trainAddBtn.on('click', function (e) {
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
  // Call function to reset form passing display styles for buttons
  resetForm('inline-block', 'none');
});

// Cancel button click event to clear and reset form
$trainCancelBtn.on('click', function () {
  // Call function to reset form passing display styles for buttons
  resetForm('inline-block', 'none');
});

// Delete button click event to remove node from firebase and remove element from table
$tableBody.on('click', '.delete', function () {
  if (isEditBtn) {
    // Call function to reset form passing display styles for buttons
    resetForm('inline-block', 'none');
  }
  // Call function to get table row ID that equals node key
  let key = nodeKey($(this));
  // // Query firebase database using key value and remove node
  db.ref().child(key).remove();
  $(`#${key}`).remove();
  // Below function call is made if Edit button is NOT hidden
});

// Edit button click event to load node data back into form for editing
$tableBody.on('click', '.edit', function () {
  // Call function to reset form passing display styles for buttons
  resetForm('none', 'inline-block');
  // Call function to get table row ID that equals node key
  let key = nodeKey($(this));
  // Query firebase database using key value and population form with results
  db.ref().child(key).once('value').then(function (snapshot) {
    let data = snapshot.val();
    $trainName.val(data.trainName);
    $trainDest.val(data.trainDest);
    $trainHr.val(data.trainHr);
    $trainMin.val(data.trainMin);
    $trainAm.prop('checked', data.trainPer === 1 ? true: false);
    $trainPm.prop('checked', data.trainPer === 2 ? true: false);
    $freqHrs.val(data.freqHrs);
    $freqMins.val(data.freqMins);
  });
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
        <img class="edit" src="${editImg}" alt="">
        <img class="delete" src="${delImg}" alt="">
      </td>
    </tr>`;
  $tableBody.append(html);
  console.log(key, data.trainName, data.trainDest, data.trainHr);
};

// Function to return key assigned to table row element
let nodeKey = function (obj) {
  return obj.parents('tr').attr('id');
};

// Function to clear or set to default the form's input fields
let resetForm = function (add, edit) {
  // Reset input fields
  $trainName.val("");
  $trainDest.val("");
  $trainHr.val(trainHrDef);
  $trainMin.val(trainMinDef);
  $trainAm.prop('checked', true);
  $trainPm.prop('checked', false);
  $freqHrs.val(freqHrsDef);
  $freqMins.val(freqMinsDef);
  
  // Reset form buttons
  $trainAddBtn.css('display', add);
  $trainEditBtn.css('display', edit);
  // If Add button display is none, Edit button state is true
  isEditBtn = (add === 'none' ? true : false);
};

