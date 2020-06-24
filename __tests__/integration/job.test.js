const request = require("supertest");
const app = require("../../app")

const Job = require("../../models/job")
const Company = require("../../models/company")

const db = require("../../db")

const {
    testConstants,
    afterAllHook,
    afterEachHook,
    beforeEachHook
} = require('./config')



describe('Test jobs routes', () => {
    beforeEach(async () => {

        await beforeEachHook(testConstants)
    })

    test("Get all jobs", async () => {
        let res = await request(app).get('/jobs').send({
            "_token": testConstants.userToken
        })
        expect(res.body).toEqual({
            "jobs": [{
                    "title": "testTitle",
                    "company_handle": "tst"
                }, {
                    
                    "title": "testTitle2",
                    "company_handle": "Pep"
                }

            ]
        })
    })

    test("Get job by Id", async () => {
        let jb = await db.query('SELECT id FROM jobs WHERE jobs.salary = 20000')
        let id = jb.rows[0].id
        let res = await request(app).get(`/jobs/${id}`).send({
            "_token": testConstants.userToken
        })

        expect(res.body).toEqual({
            "job": {
                id: id,
                "title": "testTitle",
                "salary": 20000,
                "equity": 0.10,
                "company_handle": "tst",
                "date_posted": expect.any(String)
            }
        })
    })

    test("Update job by Id", async () => {
        let jb = await db.query('SELECT id FROM jobs WHERE jobs.salary = 20000')
        let id = jb.rows[0].id
        let res = await request(app).patch(`/jobs/${id}`).send({
            "_token": testConstants.userToken,
            "equity": 0.90
        })

        expect(res.body).toEqual({
            "job": {
                id: id,
                "title": "testTitle",
                "salary": 20000,
                "equity": 0.90,
                "company_handle": "tst",
                "date_posted": expect.any(String)
            }
        })
    })

    test("Delete Job", async () => {
        let jb = await db.query('SELECT id FROM jobs WHERE jobs.salary = 20000')
        let id = jb.rows[0].id
        const res = await request(app).delete(`/jobs/${id}`).send({
            "_token": testConstants.userToken,
        })

        expect(res.body).toEqual({
            message: "Job Deleted"
        })


    })

    afterEachHook(async () =>  {
        await afterEachHook();
    })

    afterAll(async () =>   {
        await afterAllHook()
    })

});