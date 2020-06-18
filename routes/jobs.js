const Router = require('express').Router;
const router = new Router();

// Json Schema validtor
const {
    validate
} = require("jsonschema");

const jobNewSchema = require("../schemas/jobNew.json")
const jobUpdateSchema = require("../schemas/jobUpdate.json")

const ExpressError = require('../helpers/expressError');

const Job = require('../models/job');
const Company = require('../models/company');

// Start routes
router.get('/', async (req, res, next) => {
    try {
        const allJobs = await Job.getAll()
        return res.json({
            jobs: allJobs
        })
    } catch (e) {
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let validation = validate(req.body, jobNewSchema)
        if (!validation.valid) {
            return next({
                status: 400,
                error: validation.errors.map(e => e.stack)
            })
        }
        const newJob = await Job.create(req.body)
        return res.status(201).json({
            job: newJob
        })
    } catch (e) {
        next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        id = req.params.id
        const job = await Job.getById(id)
        return res.json({
            job: job
        })
    } catch (error) {
        next(error)
    }
})


router.patch('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const validation = validate(req.body, jobUpdateSchema)
        if (!validation.valid) {
            return next({
                status: 400,
                error: validation.errors.map(e => e.stack)
            })
        }
        const updateJob = await Job.update(req.body, id)
        return res.json({job: updateJob})
    } catch (e) {
        next(e)
    }
})



router.delete('/:id', async (req, res, next) => {
    try {
        id = req.params.id
        result = await Job.delete(id)
        return res.json({
			message: "Company Deleted"
		})
    } catch (error) {
        next(error)
    }
})

module.exports = router