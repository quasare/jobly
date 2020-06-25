// Company DB
const db = require("../db")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")

// Company class
class Company {

    // Create/register user method
    static async create({
        handle,
        name,
        num_employees,
        description,
        logo_url
    }) {
        const result = await db.query(`
        INSERT INTO companies (
            handle, 
            name, 
            num_employees, 
            description, 
            logo_url
        )VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, num_employees, description, logo_url
        `, [handle, name, num_employees, description, logo_url])
        return result.rows[0]
    }

    // Get all users methods
    static async getAll() {
        const result = await db.query(`
        SELECT handle, name FROM companies;`)
        return result.rows
    }

    // Get by handle method
    static async get(handle) {
        const res = await db.query(`
            SELECT * FROM companies AS c WHERE c.handle = $1
        `, [handle])

        const company = res.rows[0]

        const res2 = await db.query(`SELECT * FROM jobs WHERE jobs.company_handle = $1`, [handle])

        company.jobs = res2.rows
        return company
    }

    // Update company in db
    static async update(data, handle){
        const {query, values} = partialUpdate('companies', data, "handle",handle)
        
        const updatedCompany = await db.query(`${query}`, values)
        return updatedCompany.rows[0]
    }

    // Delete company
    static async delete(handle){
        const company = await db.query(`
        DELETE FROM companies AS c WHERE c.handle = $1 `, [handle])
    }

}


module.exports = Company