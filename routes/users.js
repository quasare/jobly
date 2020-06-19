const Router = require('express').Router;
const router = new Router();

const ExpressError = require('../helpers/expressError');

// Json Schema validtor
const {
    validate
} = require("jsonschema");

const userNewSchmea = require('../schemas/userNew.json')
const userUpdateSchmea = require('../schemas/jobUpdate.json')

const User = require('../models/user');
const db = require('../db');

// Start routes
router.post('/', async (req, res, next ) => {
    try {
        const validation = validate(req.body, userNewSchmea)
        if (!validation.valid) {
            return next({
                status: 400,
                error: validation.errors.map(e => e.stack)
            })
        }
        let newUser = await User.create(req.body)
        return res.json({user: newUser})
    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next ) => {
    try {
        const allUsers = await User.getAll()
        return res.json({users: allUsers})
    } catch (error) {
        next(error)
    }
})

router.get('/:username', async (req, res, next ) => {
    try {
        const user = await User.get(req.params.username)
        return res.json({user: user})
    } catch (error) {
        next(error)
    }
})

router.patch('/:username', async (req, res, next ) => {
    try {
        const username = req.params.username
        const validation = validate(req.body, userUpdateSchmea)
        if (!validation.valid) {
            return next({
                status: 400,
                error: validation.errors.map(e => e.stack)
            })
        }
        const updatedUser = await User.update(req.body, username)
        return res.json({user: updatedUser})
    } catch (error) {
        next(error)
    }
})

router.delete('/:username', async (req, res, next ) => {
    try {
       await User.delete(req.params.username)
       return res.json({message: "User deleted"})
    } catch (error) {
        next(error)
    }
})



module.exports = router