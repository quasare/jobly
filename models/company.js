const db = require("../db")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")

// Company class
class Company {

    static async create({
        handle,
        name,
        num_empoloyees,
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
        `, [handle, name, num_empoloyees, description, logo_url])
        return result.rows[0]
    }

    static async getAll() {
        const result = await db.query(`
        SELECT handle, name FROM companies;`)
        return result.rows
    }

    static async get(handle) {
        const company = await db.query(`
            SELECT * FROM companies AS c WHERE c.handle = $1
        `, [handle])
        return company.rows[0]
    }

    static async update(data, handle){
        const {query, values} = partialUpdate('companies', data, "handle",handle)
        console.log(query, values);
        
        const updatedCompany = await db.query(`${query}`, values)
        return updatedCompany.rows[0]
    }

    static async delete(handle){
        const company = await db.query(`
        DELETE FROM companies AS c WHERE c.handle = $1 `, [handle])
    }

}


module.exports = Company