const request = require("supertest");
const app = require("../../app")

const Job = require("../../models/job")
const Company = require("../../models/company")
const User = require('../../models/user')

const db = require("../../db")

describe('Test User routes', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM users")
        let testUser = await User.create({
            "username": "testuser",
            "password": 'test123',
            "first_name": "joe",
            "last_name": "test",
            "email": "test@test.com",
            "photo_url": 'test@url.com',
            "is_admin": false
        })
    })

    test("Get all users", async () => {
        let res = await request(app).get('/users')
        expect(res.body).toEqual({
            "users": [{
                "username": "testuser",
                "first_name": "joe",
                "last_name": "test",
                "email": "test@test.com"
            }]
        })
    })

    test("Get user by username", async () => {
        let res = await request(app).get('/users/testuser')
        expect(res.body).toEqual({
            user: {
                "username": "testuser",
                "first_name": "joe",
                "last_name": "test",
                "email": "test@test.com",
                "photo_url": 'test@url.com',
            }
        })
    })

    test("Create user", async () => {
        let res = await request(app).post('/users').send(
            {
                "username": "testuser2",
                "password": 'test123',
                "first_name": "joe2",
                "last_name": "test2",
                "email": "test2@test.com",
                "photo_url": 'test2@url.com',
                "is_admin": false
            }
        )
        expect(res.body).toEqual({
            user: {username: "testuser2"}
        })
    })

    test("Update user", async () => {
        let res = await request(app).patch('/users/testuser').send({
            first_name: 'Eric'
        })
        expect(res.body).toEqual({
            user: {
                "username": "testuser",
                "first_name": "Eric",
                "last_name": "test",
                "email": "test@test.com",
                "photo_url": 'test@url.com'
            }
        })
    })

    test("Delete user", async () => {
        let res = await request(app).delete('/users/testuser2')
        expect(res.body).toEqual({
            message: "User deleted"
        })
    })
    afterAll(async function () {
        await db.end();
    })

});