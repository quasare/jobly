const Router = require('express').Router;
const router = new Router();

// Json Schema validtor
const {validate} = require("jsonschema");

// Json schemas
const companySchema = require("../schemas/company.json")
const companyUpdateSchema = require("../schemas/companyUpdate.json")

const ExpressError = require('../helpers/expressError');

// Company model 
const Company = require('../models/company');

const {ensureLoggedIn, ensureIsAdmin} = require('../middleware/auth')


// Start routes
router.get('/', ensureLoggedIn, async (req, res, next) => {
	try {
		let companies = await Company.getAll();
		return res.json({
			companies
		});
	} catch (error) {
		next(error);
	}
});

router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const validation = validate(req.body, companySchema)
		if (!validation.valid) {
			return next({
				status: 400,
				error: validation.errors.map(e => e.stack)
			})
		}
		let newCompany = await Company.create(req.body);
		return res.status(201).json({
			company: newCompany
		});
	} catch (error) {
		return next(error);
	}
});

router.get('/:handle', ensureLoggedIn, async (req, res, next) => {
	try {
		const handle = req.params.handle;
		let company = await Company.get(handle);
		return res.json({
			company: company
		});
	} catch (error) {
		next(error);
	}
});

router.patch('/:handle', ensureIsAdmin, async (req, res, next) => {
	try {
		let update = req.body
		let handle = req.params.handle
		let validation = validate(update, companyUpdateSchema)
		if (!validation.valid){
			return next({
				status: 400,
				error: validation.errors.map(e => e.stack)
			})
		}
		let result = await Company.update(req.body, handle)
		return res.json({company: result})
	} catch (error) {
		next(error)
	}
});

router.delete('/:handle', ensureIsAdmin, async (req, res, next) => {
	try {
		handle = req.params.handle
		result = await Company.delete(handle)
		return res.json({
			message: "Company Deleted"
		})
	} catch (error) {
		next(error)
	}
});

module.exports = router;