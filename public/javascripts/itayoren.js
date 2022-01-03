(function () {
    let email = null;
    let pass = null;

    function validatePasswordAndSendToServer(event)
    {
        event.preventDefault();
        restartErrorMassage();
        if ((email.value.trim() !== '') && (pass.value.trim() !== ''))
            document.getElementById("login").submit();
        if (email.value.trim() === '' && pass.value.trim() === '')
        {
            setErrorMassage(email);
            setErrorMassage(pass);
        }
        else if(email.value.trim() === '')
            setErrorMassage(email);
        else
            setErrorMassage(pass);
    }

    const setErrorMassage = (element) => {
        let errorElement = element.nextElementSibling;
        errorElement.innerHTML = 'input required here' ;
        element.classList.add("is-invalid");
    }


    const restartErrorMassage = (element) => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    document.addEventListener('DOMContentLoaded', function () {

        email = document.getElementById('email');
        pass = document.getElementById('password');

        document.getElementById("login").addEventListener("submit", validatePasswordAndSendToServer);
    });
})();