const db = require('../models');


/**
 * this is an api request from the client which checks if the email is in the system.
 * returns a json which says if the email exists or not.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<Model[]>}
 */
exports.checkEmailExist = (req, res, next) => {
    let resource = {flag : true};
    let email = req.query.email;

    return db.Contact.findAll({where: {email}})
        .then((contacts) =>
        {
            if (contacts.length === 0)
                res.json(resource);
            else
            {
                resource.flag = false;
                res.json(resource);
            }
        })
        .catch((err) => {
            res.redirect('/')
        });
}

/**
 * this is a request that when it gets to route '/' then it returns a html page.
 * @param req
 * @param res
 * @param next
 */
exports.showHomePage = (req,res,next) => {
    res.render('index', { title: 'Register' });
}

/**
 * this is a request that when it gets to route '/login' from a post request and returns a html page.
 * @param req
 * @param res
 * @param next
 */
exports.loginFromHomePage = (req,res,next) => {
    req.session.loginSuccess = false;
    res.render('login', { title: 'Login' });
}

/**
 * this is a request that when it gets to route '/login' from a get request and returns a html page.
 * @param req
 * @param res
 * @param next
 */
exports.loginAfterSignIn = (req,res,next) => {
    if (req.session.signIn)
        res.render('login', { title: 'Congratulation, now login' });
    else if(req.session.failLogIn)
        res.render('login', { title: 'Your email or password incorrect' });
    else
        res.render('login', { title: 'Login' });
}

/**
 * this is a request that when it gets to route '/nasa' from a post request and checks if the user is on the system,
 * and if so it will send him to the nasa html page, and if not then an error message will come up on the screen.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<Model[]>}
 */
exports.checkLoginToNasaPage = (req,res,next) => {
    req.session.signIn = false;
    req.session.failLogIn = false;
    const email = req.body.email;
    const password = req.body.password;

    return db.Contact.findAll({where: {email, password}})
        .then((contacts) =>
        {
            if (contacts.length === 0)
            {
                req.session.failLogIn = true;
                res.redirect('/login');
            }
            else
            {
                req.session.loginSuccess = true;

                return db.Photos.findAll({email})
                    .then((contact) => {
                        res.render('nasa', {user : req.body.email, email : req.body.email, photos: contact});
                    })
                    .catch((err) => {
                        res.redirect('/');
                    })
            }
            })
        .catch((err) => {
        });
}

/**
 * this is an api request to save a photo and receives in the request the photo, checks in the database if it exists
 * and if it does not, then it will add it and return a message to the user if it was added.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<Model[]>}
 */
exports.savePicForUser = (req,res,next) => {

    let resource = {flag : false , login : true};

    if(req.session.loginSuccess === false)
    {
        resource.login = false;
        res.json(resource);
    }

    const img_src = req.body.object.img_src;
    const id_pic = req.body.object.id_pic.toString();
    const land_date = req.body.object.land_date;
    const sol_num = req.body.object.sol_num.toString();
    const camera_take = req.body.object.camera_take;
    const email = req.body.email;

    return db.Photos.findAll({where: {email, id_pic}})
        .then((contacts) =>
        {
            if (contacts.length === 0)
            {
                return db.Photos.create({email, img_src, land_date, id_pic,sol_num,  camera_take})
                    .then((contact) => {
                        resource.flag = true;
                        res.json(resource);
                    })
                    .catch((err) => {
                        resource.login = false;
                        res.json(resource);
                    })
            }
            else
                res.json(resource);
        })
        .catch((err) => {
        });
}

/**
 * receives an api request and receives the photo that needs to be deleted, deletes it and sends a message to the user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<T>}
 */
exports.deletePicForUser = (req,res,next) => {
    let resource = {login : true};

    if(req.session.loginSuccess === false)
    {
        resource.login = false;
        res.json(resource);
    }

    const email = req.query.email;
    const id_pic = req.query.id;

    return db.Photos.findOne({where: {email, id_pic}})
        .then((contact) => {
            contact.destroy({force :true})
            res.json(resource);
        })
        .catch((err) => {
            resource.login = false;
            res.json(resource);
        })
}

/**
 * receives an api request to delete all photos of the user and returns success or failure.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<T>}
 */
exports.deleteAll = (req,res,next) => {
    let resource = {login : true};

    if(req.session.loginSuccess === false)
    {
        resource.login = false;
        res.json(resource);
    }

    const email = req.query.email;

    return db.Photos.destroy({where: {email}})
        .then((contact) => {
            res.json(resource);
        })
        .catch((err) => {
            resource.login = false;
            res.json(resource);
        })
}
