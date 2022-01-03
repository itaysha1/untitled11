emails = [];


const pushEmail = (object) => {
    emails.push(object);
};

const checkEmail = (email) => {
    for (const user of emails)
        if (user.Email === email)
            return false;
        return true;
};

const checkAvailableUser = (object) => {
    for (const user of emails)
        if (user.Email === object.Email && user.Password === object.Password)
            return true;
        return false;
};



module.exports = {pushEmail, checkEmail, checkAvailableUser};