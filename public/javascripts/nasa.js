"use strict";

const APIKEY = '9noKlhlIAwFHWrZnXhSyBLFGeFk0KIFvd96TbEY8';

/**
 * function that check if the ajax request seccess or failed
 * @param response
 * @returns {Promise<never>|Promise<unknown>}
 */
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

/**
 * a ModUle that handle with a request send it to the nasa servers
 * and set the deatails in the array and in the html page
 * @type {{}}
 */
const requestModule = (function () {
    let classes = {};

    /**
     *A class that send the request to nasa server and save the json in array
     * also show the photos if the search seccuess
     * if not shot massage to the user
     * @type {classes.requestPhotos}
     */
    classes.requestPhotos = class requestPhotos {
        constructor(date, camera, mission) {
            this.date = date;
            this.camera = camera;
            this.mission = mission;
            this.pictures = null;


            this.link = this.mission + '/photos?';
            if (date.length <= 5)
                this.link += 'sol=' + this.date + '&';
            else
                this.link += 'earth_date=' + this.date + '&';
            camera.toLowerCase();
            this.link += 'camera=' + camera + '&api_key=' + APIKEY;
        }

        /**
         * function that send the reaquest to nasa server and save the jason in array
         * @param attachListener
         * @param setNoImagesFounded
         */
        sendRequestAndGetObject(attachListener, setNoImagesFounded) {
            document.getElementById("result").innerHTML = "<img src='images/loading-buffering.gif'>";
            fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + this.link)
                .then(status)
                .then(res => res.json())
                .then(json => {
                    this.pictures = json.photos;
                    this.handleRequest(attachListener, setNoImagesFounded);
                })
                .catch(function (err) {
                    alert('NASA servers are not available right now, please try again later');
                    document.getElementById('search').disabled = true;
                })
        }

        /**
         * function that handle the request if the search success she show the result
         * if not she send to the user a massage
         * @param attachListener
         * @param setNoImagesFounded
         */
        handleRequest(attachListener, setNoImagesFounded) {
            document.getElementById("result").innerHTML = "";
            for (const pic of this.pictures)
                document.getElementById("result").innerHTML += this.toHtmlCard(pic);
            if (this.pictures.length === 0)
                setNoImagesFounded();
            else
                attachListener();
        }

        /**
         * function the brings the json
         * @returns {null}
         */
        getPictures() {
            return this.pictures;
        }

        /**
         * function that make the html card for each photo from the result
         * @param pic
         * @returns {string}
         */
        toHtmlCard(pic) {
            return `
        <div class="col-12 col-md-4 col-lg-2">
                <div class="card" style="width: 15rem;">
                    <img src=${pic.img_src} class="card-img-top" alt="..." width="238px" height="238px">
                    <div class="card-body">
                        <p class="card-text">Earth date : ${pic.earth_date}</p>
                        <p class="card-text">sol : ${pic.sol}</p>
                        <p class="card-text">camera : ${pic.camera.name}</p>
                        <p class="card-text">Mission : ${pic.rover.name}</p>
                        <button class="btn-save btn btn-secondary" id=${pic.id}> Save</button>
                        <button class="btn-size btn btn-secondary" id=${pic.id}> Full Size</button>
                    </div>
                </div>
                </div>
                `;
        }
    }

    return classes;

})();

/**
 * a Module that sent the first request to get the details for each mission
 * @type {{}}
 */
const nasaModule = (function () {
    let classes = {}

    classes.Mission = class Mission {
        constructor(name) {
            fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + name + '?api_key=' + APIKEY)
                .then(status)
                .then(res => res.json())
                .then(json => {
                    this.title = name;
                    this.sol = json.photo_manifest.max_sol;
                    this.startDate = json.photo_manifest.landing_date;
                    this.lastDate = json.photo_manifest.max_date;
                })
                .catch(function (err) {
                    alert('NASA servers are not available right now, please try again later');
                    document.getElementById('search').disabled = true;
                })
        }
    }
    return classes;
})();

const curiosityMission = new nasaModule.Mission('Curiosity');
const opportunityMission = new nasaModule.Mission('Opportunity');
const spiritMission = new nasaModule.Mission('Spirit');


/**
 * A validater module
 * @type {{isEmpty: (function(*): {isValid, message: string}), isValidDate: (function(*=): {isValid: boolean, message: string}), isValidSol: (function(*=): {isValid, message: string}), isDateOffMission: (function(*, *=): {isValid: boolean, massage: *})}}
 */
const validatorModule = (function () {

    /**
     * a Function that get a str and returns if its valid date
     * if not she also return the massage error
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const isValidDate = function (str) {
        let v;
        let flag = true;
        if (/^([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})$/.test(str))
            v = getRealDate(str);
        if (!(v === str))
            flag = false;
        return {
            isValid: flag,
            message: 'please enter a SOL number or a valid date'
        }
    }

    const getRealDate = function (date) {
        let realDate = new Date(date.toString());
        let YYYY = realDate.getFullYear();
        let MM = (realDate.getMonth() + 1 < 10 ? '0' + (realDate.getMonth() + 1)
            : realDate.getMonth() + 1)
        let DD = (realDate.getDate() < 10 ? '0' + realDate.getDate()
            : realDate.getDate());

        return (YYYY + '-' + MM + '-' + DD);
    }

    /**
     * a Function that get a str and returns if its valid sol
     * if not she also return the massage error
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const isValidSol = function (str) {
        let max_sol = Math.max(curiosityMission.sol, opportunityMission.sol, spiritMission.sol);
        return {
            isValid: /^([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]|[0])$/.test(str) && str < max_sol,
            message: 'please enter a SOL number or a valid date'
        }
    }

    /**
     * a Function that get a str and returns if its empty
     * if not she also return the massage error
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const isEmpty = function (str) {
        return {
            isValid: !(str === '' || str === 'Choose a rover' || str === 'Choose a camera'),
            message: 'Input is required here'
        }
    }

    /**
     * a Function that get a str and returns if its valid date for the mission
     * if not she also return the massage error
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const isDateOffMission = function (mission, date) {
        let massage;
        let v = true;
        let mission_compare;
        if (mission === curiosityMission.title)
            mission_compare = curiosityMission;
        else if (mission === opportunityMission.title)
            mission_compare = opportunityMission;
        else
            mission_compare = spiritMission;

        if (/^([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]|[0])$/.test(date)) {
            if (date > mission_compare.sol) {
                v = false;
                massage = 'the mission you selected requiers a sol before' + mission_compare.sol;
            }
        } else {
            if (date > mission_compare.lastDate) {
                massage = 'the mission you selected requiers a date before' + mission_compare.lastDate;
                v = false;
            } else if (date < mission_compare.startDate) {
                massage = 'the mission you selected requiers a date after' + mission_compare.startDate;
                v = false;
            }
        }

        return {
            isValid: v,
            massage: massage
        }
    }

    return {
        isValidDate: isValidDate,
        isValidSol: isValidSol,
        isEmpty: isEmpty,
        isDateOffMission: isDateOffMission,
    }
})();


/**
 * A musole that handle with the save picture mission has a array that save the picture that save
 * also has the details for each mission also has a function that find if picture already exist
 * and a function the make for each picture a html card
 * @type {{}}
 */
const savePictureModule = (function () {
    let classes = {}

    classes.savePicture = class savePicture {
        constructor(img, date, id, sol, camera) {
            this.img_src = img;
            this.id_pic = id;
            this.land_date = date;
            this.sol_num = sol;
            this.camera_take = camera;
        }

        toHtmlCard() {
            return `<li id = ${this.id_pic}>
                <button type="button" class="btn-close" aria-label="Close" id = ${this.id_pic}></button>           
                <a href=${this.img_src} target="_blank">Image id: ${this.id_pic}</a>
                <p>Earth date:${this.land_date}, Sol:${this.sol_num}, Camera:${this.camera_take}</p>
                </li>`;
        }
    }
    return classes;
})();

(function () {

    // elements initialization happens in DOMContentLoaded
    let dateInput = null;
    let missionInput = null;
    let cameraInput = null;
    let result = null;
    let request = null;
    let savePictureEl = null;

    /**
     * function that set massage to user in a case that no images found
     */
    const setNoImagesFounded = () => {
        result.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                No images found!
            </div>
        `
    }

    const clearErrorMassages = () => {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");

    }

    const clearForm = () => {
        clearErrorMassages();
        result.innerHTML = "";
    }


    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    /* validate the input elements */
    const validateForm = (dateInput, missionInput, cameraInput) => {
        let v1, v3, v4, v5;
        v3 = validateInput(dateInput, validatorModule.isEmpty);
        if (v3) {
            v1 = validateInput(dateInput, validatorModule.isValidDate) || validateInput(dateInput, validatorModule.isValidSol);
        }
        v4 = validateInput(missionInput, validatorModule.isEmpty);
        v5 = validateInput(cameraInput, validatorModule.isEmpty);
        let v = v1 && v3 && v4 && v5;
        if (v) {
            let v6 = validatorModule.isDateOffMission(missionInput.value, dateInput.value);
            if (!v6.isValid) {
                v = false;
                dateInput.nextElementSibling.innerHTML = v6.massage;
            }
        }
        return v;
    }

    /** attach listeners to save buttons and full size buttons */
    const attachListener = () => {
        for (const b of document.getElementsByClassName("btn-save")) {
            b.addEventListener('click', () => {
                savePicture();
            });
        }

        for (const b of document.getElementsByClassName("btn-size")) {
            b.addEventListener('click', () => {
                showFullScreen();
            });
        }
    }

    /**
     * this function sends a api request to the server to delete a photo and receives an answer and will
     * do as needed.
     */
    const deletePicture = () => {
        document.getElementById("test").innerHTML="<img src='images/loading-buffering.gif'>";
        for (let v of savePictureEl.childNodes)
            if (window.event.target.id === v.id)
                v.remove();

        document.getElementById("test").innerHTML="<img src='images/loading-buffering.gif'>";
        fetch(`api/clear?email=${document.getElementById('email').value}&id=${window.event.target.id}`, {
            method: "DELETE",
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            document.getElementById("test").innerHTML="";
            if (data.login === false)
                document.getElementById("logout").submit();
        })
            .catch(function (err) {
                alert('servers are not available right now, please try again later');
            })
    }

    const attachListenerDelete = () => {

        for (const b of document.getElementsByClassName("btn-close")) {
            b.addEventListener('click', () => {
                deletePicture();
            });
        }
    };


    /**
     * handle with user push save button
     */
    const savePicture = () => {
        let id = window.event.target.id;
        let newID = parseInt(id);
        const searchPictures = request.getPictures();
            for (const r of searchPictures)
                if (newID === r.id) {
                    let new_pic = new savePictureModule.savePicture(r.img_src, r.earth_date, r.id, r.sol, r.camera.name);
                    savePictureInServerClient(new_pic, document.getElementById('email').value);
                }
    }

    /**
     * this function requests an api request to save a photo and receives an answer and will as needed.
     * @param pic
     * @param email
     */
    function savePictureInServerClient(pic, email) {
        document.getElementById("test").innerHTML="<img src='images/loading-buffering.gif'>";
        fetch("api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "object" : pic,
                "email" : email
            })
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            document.getElementById("test").innerHTML="";
            if (data.login === false)
                document.getElementById("logout").submit();
            else if (data.flag)
            {
                savePictureEl.innerHTML +=pic.toHtmlCard();
                attachListenerDelete();
            }
            else
                alert('THis image already saved');
        })
            .catch(function (err) {
                alert('servers are not available right now, please try again later');
            })
    }

    /**
     * sends an api request to the server to delete all the photos of the user, receives an answer and will act
     * as needed.
     */
    function clearList()
    {
        document.getElementById("test").innerHTML="<img src='images/loading-buffering.gif'>";
        fetch(`api/clear?email=${document.getElementById('email').value.trim()}`, {
            method: "DELETE",
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            document.getElementById("test").innerHTML="";
            savePictureEl.innerHTML = '';
            if (data.login === false)
                document.getElementById("logout").submit();
        })
            .catch(function (err) {
                alert('servers are not available right now, please try again later');
            })
    }

    /**
     * handle with user push full screen button
     */
    const showFullScreen = () => {
        let id = window.event.target.id;
        let newID = parseInt(id);
        const searchPictures = request.getPictures();
        for (const r of searchPictures)
            if (newID === r.id) {
                window.open(`${r.img_src}`);
            }
    }

    /**
     * handle with user input is good and we sent a request to nasa server
     */
    const requestPhotos = (dateInput, missionInput, cameraInput) => {
        request = new requestModule.requestPhotos(dateInput.value, cameraInput.value, missionInput.value);
        request.sendRequestAndGetObject(attachListener, setNoImagesFounded);
    }


    document.addEventListener('DOMContentLoaded', function () {

        dateInput = document.getElementById("date");
        missionInput = document.getElementById('rover');
        cameraInput = document.getElementById('camera');
        result = document.getElementById('result');
        savePictureEl = document.getElementById('photos');

        let theform = document.getElementById('searchform');
        theform.addEventListener("submit", (event) => {
            event.preventDefault();
            if (validateForm(dateInput, missionInput, cameraInput)) {
                requestPhotos(dateInput, missionInput, cameraInput);
            }
        });

        for (const b of document.getElementsByClassName("btn-close")) {
            b.addEventListener('click', () => {
                deletePicture();
            });
        }

        document.getElementById('reset').addEventListener('click', clearForm);

        document.getElementById('clearall').addEventListener('click', clearList);
    });
})();