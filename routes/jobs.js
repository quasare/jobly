const Router = require('express').Router;
const router = new Router();

// Json Schema validtor
const {
    validate
} = require("jsonschema");

//// Json schemas to validate against
const jobNewSchema = require("../schemas/jobNew.json")
const jobUpdateSchema = require("../schemas/jobUpdate.json")

const ExpressError = require('../helpers/expressError');

// Auth middleware import
const {ensureLoggedIn, ensureIsAdmin} = require('../middleware/auth')

// Job model import
const Job = require('../models/job');


// Start routes
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const allJobs = await Job.getAll()
        return res.json({
            jobs: allJobs
        })
    } catch (e) {
        next(e)
    }
})

// Create job 
router.post('/', ensureIsAdmin, async (req, res, next) => {
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

// Get job by ID
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
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

// Update single job
router.patch('/:id', ensureIsAdmin, async (req, res, next) => {
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


// Delete job
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
    try {
        id = req.params.id
        result = await Job.delete(id)
        return res.json({
			message: "Job Deleted"
		})
    } catch (error) {
        next(error)
    }
})

module.exports = router