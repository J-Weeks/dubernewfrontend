'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

$(document).ready(function(){
  setupClicks();
  // checkUser();
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

  $('.editInfo').on('click', function(e){
    e.preventDefault();
    $('#edit-info-modal').modal('show');
  });

  $('.edit-Info').on('submit', function(e){
    e.preventDefault();
    let formData = new FormData(e.target);
    userUpdate(formData);
  });
  // end modals

//sign up
  $('.sign-up').on('submit', function(e){
    e.preventDefault();
    let formData = new FormData(e.target);

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
    $('#signInModal').modal('hide');
    getDogs(userData);
    userUpdateFill(userData);
  }).fail(function(userData){
    console.log('sign in failed')
    console.log(userData);
  });
};

let userUpdateFill = function(){
  let userData = localStorage.getItem('User');
  userData = JSON.parse(userData);
  $('#inputEmail').val(userData.email);
  $('#inputNameFirst').val(userData.first_name);
  $('#inputNameLast').val(userData.last_name);
  $('#inputAddress').val(userData.address);
  $('#inputDescription').val(userData.description);
  $('#inputUrl').val(userData.url);
  $('#inputToken').val(userData.token);
};

let userUpdate = function(formData){

  let userinfo = localStorage.getItem('User');
  userinfo = JSON.parse(userinfo);
  $.ajax({
    // url: "https://www.googleapis.com/upload/mirror/v1/",
    url: "http://localhost:3000/users/" + userinfo.id,
    headers: {
            Authorization: 'Token token=' + userinfo.token,
          },
    method: 'PATCH',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(userData){
    localStorage.removeItem('User');
    localStorage.setItem('User', JSON.stringify(userData));
      $('#edit-info-modal').modal('hide');
  }).fail(function(data){
    console.log('user update failed');
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

let getDogs = function(userData, usersToo){
  $.ajax({
    // url: "http://localhost:3000/dogs",
    url: "http://localhost:3000/users/" + userData.id,
    headers: {
            Authorization: 'Token token=' + userData.token,
          },
    method: 'GET',
    dataType: 'json'
  }).done(function(dogs){
    if(usersToo){
      displayUsers(dogs);
    }else{
      displayDogs(dogs.dogs);
    }
  });
};

let displayUsers = function(user){
  $('.navbar').first().addClass('primary-nav');
  let userNavTemplate = require('./templates/usernav.handlebars');
  //  debugger;
  $('.primary-nav').after(userNavTemplate({
    user
  }));
  displayDogs(user.dogs);
};

let displayDogs = function(dogs){
  $('.primary-content').html('');
  let dogsTemplate = require('./templates/dogs.handlebars');  // debugger;

  $('.primary-content').append(dogsTemplate({
    dogs
  }));
  editDog();
};

let editDog = function(){
  //add click regist once dogs templates are loaded
    $('.edit-dog').on('click', function(e){
      e.preventDefault();
      let dogId = $(e.target).attr('data-id');
      $('.update-dog').attr('data-id', dogId);

      $.ajax({
        // url: "http://localhost:3000/dogs",
        url: "http://localhost:3000/dogs/" + dogId,
        method: 'GET',
        dataType: 'json'
      }).done(function(dog){
        fillEditDog(dog);
      }).fail(function(dog){
        console.log('editDog GET failed');
      });
    });

    $('#editDogModal').on('submit', function(e){
        e.preventDefault();
        let formData = new FormData(e.target);
        updateDog(formData);
    });
};

let fillEditDog = function(dog){
  $('#inputname').val(dog.name);
  $('#inputbreed').val(dog.breed);
  $('#inputdescription').val(dog.description);
  $('#inputsize').val(dog.size);
  $('#inputnote').val(dog.note);
  $('#inputurl').val(dog.url);

  $('#editDogModal').modal('show');
};

let updateDog = function(formData){
  let dogId = $('.update-dog').attr('data-id');
  $.ajax({
    // url: "https://www.googleapis.com/upload/mirror/v1/",
    url: "http://localhost:3000/dogs/" + dogId,
    method: 'PATCH',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(data){
    $('#editDogModal').modal('hide');
    let userinfo = localStorage.getItem('User');
    userinfo = JSON.parse(userinfo);
    let usersToo = false;
    getDogs(userinfo, usersToo);
  }).fail(function(data){
    console.log('update dog failed');
  })
};
