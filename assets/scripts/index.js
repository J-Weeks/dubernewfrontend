'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

$(document).ready(function(){
  setupClicks();
  checkUser();
});

let checkUser = function(){
  let userinfo = localStorage.getItem('User');
  userinfo = JSON.parse(userinfo);
  if(userinfo !== null){
    debugger;
    $('#signInModalLabel').text('Back Again! Please Sign In.')
    $('.sign').toggleClass('hide');
  }
}

let setupClicks = function(){
// modals
  $('.signup').on('click', function(e){
    e.preventDefault();
    $('#signUpModal').modal('show');
  });

  $('.signin').on('click', function(e){
    e.preventDefault();
    $('#signInModal').modal('show');
  });

  $('.signout').on('click', function(e){
    e.preventDefault();
    let userinfo = localStorage.getItem('User');
    userinfo = JSON.parse(userinfo);
    userSignOut(userinfo);
  });

  $('.sign-in').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(e.target);
    userSignIn(formData);
  });
  // end modals

//sign up
  $('.sign-up').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(e.target);

    $.ajax({
      url: "http://localhost:3000/sign-up",
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function(data){
      userSignIn(formData);
    }).fail(function(data){
      console.log(data);
    });
  });
};

let userSignIn = function(formData){
  $.ajax({
    url: "http://localhost:3000/sign-in",
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(userData){
    $('.sign').toggleClass('hide');
    localStorage.setItem('User', JSON.stringify(userData));
    $('.splash').hide();
    getDogs(userData);
  }).fail(function(userData){
    debugger;
    console.log(userData);
  });
};

let userSignOut = function(userinfo){
  $.ajax({
    url: "http://localhost:3000/sign-out/" + userinfo.id,
    headers: {
            Authorization: 'Token token=' + userinfo.token,
          },
          method: 'DELETE',
          contentType: false,
          processData: false,
  }).done(function(){
    $('.sign').toggleClass('hide');
    localStorage.removeItem('User');
    location.reload();
  }).fail(function(){
    console.log('signout failed');
  });
};

let getDogs = function(userData){
  $.ajax({
    // url: "http://localhost:3000/dogs",
    url: "http://localhost:3000/users/" + userData.id,
    headers: {
            Authorization: 'Token token=' + userData.token,
          },
    method: 'GET',
    dataType: 'json'
  }).done(function(dogs){
    debugger;
    displayDogs(dogs.dogs);
  });
};

let displayDogs = function(dogs){
  // debugger;
  let dogsTemplate = require('./templates/dogs.handlebars');  // debugger;
  $('.primary-content').append(dogsTemplate({
    dogs
  }));
};
