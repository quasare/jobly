const request = require("supertest");
const app = require("../../app")

const Company = require("../../models/company");
const Job = require("../../models/job")
const db = require("../../db");

const {testConstants, afterAllHook, afterEachHook, beforeEachHook} = require('./config')


describe('Company Routes Test', () => {
    beforeEach(async () => {
        await beforeEachHook(testConstants)
    })

    test('Can get companies', async () => {
        let res = await request(app).get('/companies').send({
            "_token": testConstants.userToken
        })
        expect(res.body).toEqual({
            companies: [{
                    "handle": "tst",
                    "name": "test"
                },
                {
                    "handle": "Pep",
                    "name": "Pepsi"
                }
            ]
        })
    })

    test('Can create company', async () => {
        let res = await request(app).post('/companies').send({
            "_token": testConstants.userToken,
            "handle": "CC",
            "name": "Coca Cola",
            "num_employees": 555,
            "description": "Drink maker",
            "logo_url": "ewofijwe"
        })
        expect(res.body).toEqual({
            company: {
                handle: 'CC',
                name: 'Coca Cola',
                num_employees: 555,
                description: 'Drink maker',
                logo_url: 'ewofijwe'
            }
        })

    })

    test("Can get company by handle", async () => {
        let res = await request(app).get('/companies/tst').send({
            "_token": testConstants.userToken
        })

        expect(res.body).toEqual({
            company: {
                handle: "tst",
                name: "test",
                num_employees: 55,
                description: 'Test company',
                logo_url: 'testurl',
                "jobs": [{
                    "id": expect.any(Number),
                    "title": "testTitle",
                    "salary": 20000,
                    "equity": 0.10,
                    "company_handle": "tst",
                    "date_posted": expect.any(String)
                }]
            }
        })
    })

    test('Can update company', async () => {
        let res = await request(app).patch('/companies/tst').send({
            "_token": testConstants.userToken,
            handle: 'tst',
            name: 'testuser'
        })

        expect(res.body).toEqual({
            company: {
                handle: "tst",
                name: "testuser",
                num_employees: 55,
                description: 'Test company',
                logo_url: 'testurl'
            }
        })
    })

    test('Can delete user', async () => {

        let res = await request(app).delete('/companies/Pep').send({
            "_token": testConstants.userToken
        })

        expect(res.body).toEqual({
            message: "Company Deleted"
        })
    })

    afterEachHook(async () =>  {
        await afterEachHook();
    })

    afterAll(async () =>   {
        await afterAllHook()
    })
});