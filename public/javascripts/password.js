(function () {
    let passone = null;
    let passtwo = null;

    /**
     * a function that checks if the passwords are equal and in the valid format, if correct it will send the info
     * to the server and if not will send an error message.
     * @param event
     */
    function validateAndSend(event)
{
    event.preventDefault();
    restartErrorMassage();
    if (validateForm())
        document.getElementById('password1').submit();
}

    const restartErrorMassage = (element) => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    const validateForm = () => {
        if (passone.value.trim() === passtwo.value.trim())
        {
            if (passone.value.trim().length >= 8)
                return true;
            else
                setErrorMassagePass('The password must contain at least 8 digits letters or signals');
        }
        else
            setErrorMassagePass('The passwords need to match');
        return false;
    }

    const setErrorMassagePass = (str) => {
        let errorElement = passone.nextElementSibling;
        errorElement.innerHTML = str ;
        passone.classList.add("is-invalid");
    }



document.addEventListener('DOMContentLoaded', function () {

    passone = document.getElementById('passone');
    passtwo = document.getElementById('passtwo');

    document.getElementById("password1").addEventListener("submit", validateAndSend);
});
})();