const request = require("supertest");
const app = require("../../app")

const Job = require("../../models/job")
const Company = require("../../models/company")

const db = require("../../db")



describe('Test jobs routes', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM companies")
        await db.query('DELETE FROM jobs')
        let testCompany = await Company.create({
            handle: "tst",
            name: "test",
            num_employees: 55,
            description: 'Test company',
            logo_url: 'testurl'
        })
        let testJob = await Job.create({
            "title": "testTitle",
            "salary": 20000,
            "equity": 0.10,
            "company_handle": "tst"
        })
    })

    test("Get all jobs", async () => {
        let res = await request(app).get('/jobs')
        expect(res.body).toEqual({
            "jobs": [{
                "title": "testTitle",
                "company_handle": "tst"
            }]
        })
    })

    test("Get job by Id", async () => {
        let jb = await db.query('SELECT id FROM jobs WHERE jobs.salary = 20000')
        let id = jb.rows[0].id
        let res = await request(app).get(`/jobs/${id}`)

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
        let res = await request(app).patch(`/jobs/${id}`).send({"equity": 0.90})

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
        const res = await request(app).delete(`/jobs/${id}`)

        expect(res.body).toEqual({
			message: "Company Deleted"
		})


    })



    afterAll(async function () {
        await db.end();
    })

});