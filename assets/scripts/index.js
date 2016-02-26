'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

$(document).ready(function(){
  setupClicks();
  getDogs();
});

let setupClicks = function(){

  $('.signup').on('click', function(e){
    e.preventDefault();
    $('#signUpModal').modal('show');
  });

  $('.signin').on('click', function(e){
    e.preventDefault();
    $('#signInModal').modal('show');
  });
};


let getDogs = function(){
  $.ajax({
    url: "http://localhost:3000/dogs",
    method: 'GET',
    dataType: 'json'
  }).done(function(dogs){
    displayDogs(dogs);
  });
};

let displayDogs = function(dogs){
  // debugger;
  let dogsTemplate = require('./templates/dogs.handlebars');  // debugger;
  $('.primary-content').append(dogsTemplate({
    dogs
  }));
};
