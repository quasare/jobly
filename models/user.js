const db = require("../db")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")


class User {

    static async create({
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin
    }) {
        let newUser = await db.query(`INSERT INTO users (username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin)
        VALUES ($1,$2,$3,$4,$5, $6, $7) RETURNING * `, [username, password, first_name, last_name, email, photo_url, is_admin])
        
        return newUser.rows[0]
    }

    static async getAll() {
        let allUsers = await db.query(`SELECT username, first_name, last_name, email FROM users`)
        return allUsers.rows
    }

    static async get(username){
        let user = await db.query(`SELECT username, first_name, last_name, email, photo_url FROM users AS u WHERE u.username = $1`, 
        [username])
        return user.rows[0]
    }

    static async update(data, username){
        const {query, values} = partialUpdate('users', data, "username", username)
        const udpateUser = await db.query(`${query}`, values)
        return udpateUser.rows[0]
    }

    static async delete(username){
        const deletedUser = await db.query(`DELETE FROM users WHERE users.username = $1`, [username])
    }
}

module.exports = User