const db = require("../db")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");


class User {

    // Create/regsiter users with hashed password
    static async create({
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin
    }) {
        let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        let newUser = await db.query(`INSERT INTO users (username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin)
        VALUES ($1,$2,$3,$4,$5, $6, $7) RETURNING username, is_admin`, [username, hashedPassword, first_name, last_name, email, photo_url, is_admin])
        
        return newUser.rows[0]
    }

    // Authenticat user for login route
    static async authenticate(username, password) {
        const result = await db.query(
            "SELECT password FROM users WHERE username = $1",
            [username]);
        let user = result.rows[0];
    
        return user && await bcrypt.compare(password, user.password);
      }

    // Get all users
    static async getAll() {
        let allUsers = await db.query(`SELECT username, first_name, last_name, email FROM users`)
        return allUsers.rows
    }

    // Get by username
    static async get(username){
        let user = await db.query(`SELECT username, first_name, last_name, email, photo_url, is_admin FROM users AS u WHERE u.username = $1`, 
        [username])
        return user.rows[0]
    }

    // Update user
    static async update(data, username){
        const {query, values} = partialUpdate('users', data, "username", username)
        const udpateUser = await db.query(`${query}`, values)
        let user = {
            "username": udpateUser.rows[0].username,
            "first_name": udpateUser.rows[0].first_name,
            "last_name": udpateUser.rows[0].last_name,
            "email": udpateUser.rows[0].email,
            "photo_url": udpateUser.rows[0].photo_url 
        }
        return user
    }

    // Delete user
    static async delete(username){
        const deletedUser = await db.query(`DELETE FROM users WHERE users.username = $1`, [username])
    }
}

module.exports = User