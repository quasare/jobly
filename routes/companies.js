const Router = require('express').Router;
const router = new Router();

const ExpressError = require('../helpers/expressError');
const Company = require('../models/company');

router.get('/', async (req, res, next) => {
	try {
		let companies = await Company.getAll();
		return res.json({ companies });
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	try {
		let newCompany = await Company.create({
			handle         : req.body.handle,
			name           : req.body.name,
			num_empoloyees : req.body.num_employees,
			description    : req.body.description,
			logo_url       : req.body.logo_url
		});
		return res.json({ company: newCompany });
	} catch (error) {
		return next(error);
	}
});

router.get('/:handle', async (req, res, next) => {
	try {
		const handle = req.params.handle;
		let company = await Company.get(handle);
		return res.json({ company: company });
	} catch (error) {
		next(error);
	}
});

router.patch('/:handle', async (req, res, next) => {
	try {
	} catch (error) {}
});

router.delete('/:handle', async (req, res, next) => {
	try {
	} catch (error) {}
});

module.exports = router;
