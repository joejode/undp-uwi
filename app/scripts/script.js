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
    var form = document.forms.signupForm, number = form.number1.value, email = form.email1.value;
    if (isNaN(number)) {
        showError('Phone number must be a number');
        return false;
    }
    sendEmail(email);
    console.log(number);
}

function registerUser() {
    'use strict';

    $('#myModal').modal('show');
}