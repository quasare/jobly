const request = require('supertest');

const app = require('../../app');
const db = require('../../db');
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const Job = require('../../models/job')
const User = require('../../models/user')
const Company = require('../../models/company')


const testConstants = {}


const beforeEachHook = async (testConstants) => {
    await db.query("DELETE FROM companies")
    await db.query('DELETE FROM jobs')
    await db.query('DELETE FROM users')



    const hashedPassword = await bcrypt.hash('test123', 1);

    await db.query(`INSERT INTO users (username, password, first_name,last_name,email,photo_url,is_admin)
        VALUES ('testuser', $1,'joe','test','test@test.com','test@url.com',true)`, [hashedPassword]);

    const response = await request(app).post('/login').send({
        username: 'testuser',
        password: 'test123'
    })

    testConstants.userToken = response.body.token;
    testConstants.username = jwt.decode(testConstants.userToken).username;

    let testCompany = await Company.create({
        handle: "tst",
        name: "test",
        num_employees: 55,
        description: 'Test company',
        logo_url: 'testurl'
    })
    let testCompany2 = await Company.create({
        "handle": "Pep",
        "name": "Pepsi",
        "num_employees": 555,
        "description": "Drink maker",
        "logo_url": "ewofijwe"
    })


    let testJob = await Job.create({
        "title": "testTitle",
        "salary": 20000,
        "equity": 0.10,
        "company_handle": "tst"
    })
    let testJob2 = await Job.create({
        "title": "testTitle2",
        "salary": 20000,
        "equity": 0.10,
        "company_handle": "Pep"
    })

    testConstants.testCompany = testCompany
    testConstants.testCompany2 = testCompany2
    testConstants.testJob = testJob
    testConstants.testJob = testJob2

}

const afterEachHook = async () => {
    try {
        await db.query('DELETE FROM jobs');
        await db.query('DELETE FROM users');
        await db.query('DELETE FROM companies');
    } catch (error) {
        console.log("error with after each");
        
        console.error(error)
    }

}

const afterAllHook = async () => {
    try {
        await db.end();
    } catch (err) {
        console.log('error with after all');
        
        console.error(err);
    }
}

module.exports = {
    testConstants,
    beforeEachHook,
    afterEachHook,
    afterAllHook
}