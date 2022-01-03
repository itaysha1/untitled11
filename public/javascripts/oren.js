(function () {
    let passone = null;
    let passtwo = null;

function validateAndSend(event)
{
    event.preventDefault();
    restartErrorMassage();
    if (validateForm())
    {
        console.log(1);
        document.getElementById('password1').submit();
    }
}

    const restartErrorMassage = (element) => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    const validateForm = () => {
        if (passone.value === passtwo.value)
        {
            if (passone.value.length >= 8)
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

    document.getElementById("login").addEventListener("submit", validateAndSend);
});
})();