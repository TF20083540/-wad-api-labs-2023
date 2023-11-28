import express from 'express';
import User from './userModel';

const router = express.Router(); // eslint-disable-line

//Content Validation here?
const contentValidation = (body) => {
    let name = body.username;
    let pass = body.password;

    /*
    if(name == null){
        return false;
    }

    if(pass == null){
        return false;   
    }*/

    if(name == null || pass == null) return false;
    return true;
}

const passwordValidation = (password) => {
    let regEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ ;
    return regEx.test(password);
}

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', async (req, res) => {
    if(contentValidation(req.body) == false){
        res.status(401).json({
            code: 401,
            msg: 'Account Details not complete.',
        });
    } 
    else if(passwordValidation(req.body.password) == false){
        res.status(401).json({
            code: 401,
            msg: 'Password validation failed.',
        });
    }
    else{
        if (req.query.action === 'register') {  //if action is 'register' then save to DB
            await User(req.body).save();
            res.status(201).json({
                code: 201,
                msg: 'Successful created new user.',
            });
        }
        else {  //Must be an authenticate then!!! Query the DB and check if there's a match
            const user = await User.findOne(req.body);
            if (!user) {
                return res.status(401).json({ code: 401, msg: 'Authentication failed' });
            }else{
                return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' });
            }
        }




    }


});

// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});

export default router;