const request = require("supertest");
const app = require("../../app")

const Company = require("../../models/company");
const db = require("../../db");


describe('Company Routes Test', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM companies")
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
    })

    test('Can get companies', async () => {
        let res = await request(app).get('/companies')
        expect(res.body).toEqual({
            companies: [{
                "handle": "tst",
                "name": "test"
            }, 
            {
                "handle": "Pep",
                "name": "Pepsi"
            }]
        })
    })

    test('Can create users', async () => {
        let res = await request(app).post('/companies').send({
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
        let res = await request(app).get('/companies/tst')
        console.log(
            res.body
        );

        expect(res.body).toEqual({
            company: {
                handle: "tst",
                name: "test",
                num_employees: 55,
                description: 'Test company',
                logo_url: 'testurl'
            }
        })
    })

    test('Can update company', async () => {
        let res = await request(app).patch('/companies/tst').send({
            handle: 'tst',
            name: 'testuser'
        })

        expect(res.body).toEqual({company: {
            handle: "tst",
            name: "testuser",
            num_employees: 55,
            description: 'Test company',
            logo_url: 'testurl'
        }})
    })

    test('Can delete user', async () => {
        
        let res = await request(app).delete('/companies/Pep')

        expect(res.body).toEqual({
			message: "Company Deleted"
		})
    })

    afterAll(async function () {
        await db.end();
    })
});