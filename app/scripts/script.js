var contactFormUser = {};

function isReadyToSubmitForm() {
    'use strict';
    console.log(document.getElementById('userFname').value);
}

var showError = function (message) {
    'use strict';
    var error = document.getElementById('error-msg');
    error.style.visibility = 'visible';
    error.innerHTML = message;
};

var sendEmail = function (email) {
    'use strict';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            alert('Email sent');
        }
    };
    xmlhttp.open('GET', 'http://cirrusdb.hostoi.com/sendEmail.php?email=' + email, true);
    xmlhttp.send();
};

function validateForm() {
    'use strict';

    contactFormUser.userFname = document.getElementById('userFname').value;
    contactFormUser.userLname = document.getElementById('userLname').value;
    contactFormUser.userEmail = document.getElementById('userEmail').value;

    if (contactFormUser.userFname !== '' && contactFormUser.userLname !== '' && contactFormUser.userEmail !== '') {
        $('#contact-form-submit').removeClass('disabled');
    }

    /*
    var form = document.forms.signupForm, number = form.number1.value, email = form.email1.value;
    if (isNaN(number)) {
        showError('Phone number must be a number');
        return false;
    }
    sendEmail(email);
    console.log(number);
    */
}

function submitFormRequest() {
    'use strict';
    contactFormUser.checkBox = $('#userCheckBox').is(':checked');

    // the data needs to be sent somewhere to be stored

    // resetting the modal
    resetFormRequest();

    // hide back the modal
    $('#myModal').modal('hide');
    
    sendEmail(contactFormUser.userEmail);
}

function registerUser() {
    'use strict';

    // ensures the modal always resets itself after being closed
    $('#myModal').on('hidden.bs.modal', function () {
      resetFormRequest();
    });

    $('#myModal').modal('show');
}

function resetFormRequest(){
    'use strict';
    document.getElementById('userFname').value = '';
    document.getElementById('userLname').value = '';
    document.getElementById('userEmail').value = '';
    contactFormUser = {};
    $('#contact-form-submit').addClass('disabled');
}