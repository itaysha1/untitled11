"use strict";

const validatorModule = (function () {

    const isEmpty = function (str) {
        return {
            isValid: !(str === ''),
            message: 'Input is required here'
        }
    }

    const isOnlyLetters = function (str) {
        return {
            isValid: /^[a-zA-Z]+$/.test(str),
            message: 'The name must contain only letters'
        }
    }

    const isInValidEmail = function (str) {
        let v = str.toLowerCase().match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        return {
            isValid: v,
            message: 'The email invalid'
        }
    }

    return {
        isEmpty: isEmpty,
        isOnlyLetters: isOnlyLetters,
        isInValidEmail: isInValidEmail,
    }
})();



(function () {
    let name = null;
    let lastName = null;
    let email = null;

    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    const validateFormRegister = () => {
        let v1, v2, v3, v4, v5,v6;
        v1 = validateInput(name, validatorModule.isEmpty);
        v2 = validateInput(lastName, validatorModule.isEmpty);
        v3 = validateInput(email, validatorModule.isEmpty);
        if (v1 && v2)
        {
            v4 = validateInput(name, validatorModule.isOnlyLetters);
            v5 = validateInput(lastName, validatorModule.isOnlyLetters);
        }
        if (v3)
            v6 = validateInput(email, validatorModule.isInValidEmail);

        let v = v1 && v2 && v3 && v4 && v5 && v6;

        return v;
    }



    function sendAjaxOk()
    {
        let currEmail = email.value.trim().toLowerCase();
            fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "currEmail" : currEmail
                })
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data.flag)
                {
                   if (validateFormRegister())
                       document.getElementById('register').submit();
                }
                else
                    setErrorMassageEmail();
            })
    }

    const setErrorMassageEmail = () => {
        let errorElement = email.nextElementSibling;
        errorElement.innerHTML = 'This email already exist' ;
        email.classList.add("is-invalid");
    }

    const restartErrorMassage = (element) => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    function validateDataAndSendToServer(event)
    {
        event.preventDefault();
        restartErrorMassage();
        sendAjaxOk();
    }

    document.addEventListener('DOMContentLoaded', function () {
        name = document.getElementById("firstname");
        lastName = document.getElementById('lastname');
        email = document.getElementById('email');

        document.getElementById("register").addEventListener("submit", validateDataAndSendToServer);
    });
})();