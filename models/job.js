const db = require("../db")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")

class Job {

    static async create({
        title,
        salary,
        equity,
        company_handle
    }) {
        const result = await db.query(`INSERT INTO jobs(
        title, 
        salary, 
        equity, 
        company_handle, 
        date_posted
        )VALUES($1, $2, $3, $4, current_timestamp) 
        RETURNING id, title, salary, equity, company_handle, date_posted`,
            [title, salary, equity, company_handle])

        return result.rows[0]
    }

    static async getAll() {
        const result = await db.query(`SELECT title, company_handle FROM jobs`)
        return result.rows
    }

    static async getById(id){
        const result = await db.query(`SELECT * FROM jobs WHERE jobs.id = $1 `, [id])
        return result.rows[0]
    }

    static async update(data, id){
        const {query, values} = partialUpdate('jobs', data, "id", id)
        const udpateJob = await db.query(`${query}`, values)
        return udpateJob.rows[0]
    }

    static async delete(id){
        const response = db.query(`DELETE FROM jobs WHERE jobs.id = $1`, [id])
    }
}

module.exports = Job