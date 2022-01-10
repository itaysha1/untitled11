const db = require('../models');

exports.checkEmailExist = (req, res, next) => {
    let resource = {flag : true};
    let email = req.body.email;

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
            console.log(1);
        });
}

exports.showHomePage = (req,res,next) => {
    res.render('index', { title: 'Register' });
}

exports.loginFromHomePage = (req,res,next) => {
    req.session.loginSuccess = false;
    res.render('login', { title: 'Login' });
}

exports.loginAfterSignIn = (req,res,next) => {
    if (req.session.LoginFailed)
    {
        req.session.LoginFailed = false;
        res.render('login', { title: 'Your email or password incorrect' });
    }
    res.render('login', { title: 'Congratulation, now login' });
}

exports.checkLoginToNasaPage = (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password;

    return db.Contact.findAll({where: {email, password}})
        .then((contacts) =>
        {
            if (contacts.length === 0)
            {
                req.session.LoginFailed = true;
                res.redirect('/login');
            }
            req.session.loginSuccess = true;

            return db.Photos.findAll({email})
                .then((contact) => {
                    res.render('nasa', {user : req.body.email, email : req.body.email, photos: contact});
                })
                .catch((err) => {
                })
        })
        .catch((err) => {
        });
}

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
                    })
            }
            else
                res.json(resource);
        })
        .catch((err) => {
        });
}

exports.deletePicForUser = (req,res,next) => {
    let resource = {login : true};

    if(req.session.loginSuccess === false)
    {
        resource.login = false;
        res.json(resource);
    }

    const email = req.body.email;
    const id_pic = req.body.id;

    return db.Photos.findOne({where: {email, id_pic}})
        .then((contact) => {
            contact.destroy({force :true})
            res.json(resource);
        })
        .catch((err) => {
        })
}

exports.deleteAll = (req,res,next) => {
    let resource = {login : true};

    if(req.session.loginSuccess === false)
    {
        resource.login = false;
        res.json(resource);
    }

    const email = req.body.email;

    return db.Photos.destroy({where: {email}})
        .then((contact) => {
            res.json(resource);
        })
        .catch((err) => {
        })
}
