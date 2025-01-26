const express = require('express');
const { addUsers, checkIsAdmin, jwtAuth, deleteCookieToken, getUserProfile, updateUser } = require('../Controller/user.controller');
const router = express.Router()

router.put("/", addUsers)
router.get("/admin/:email", checkIsAdmin)
router.post('/jwt/:email',jwtAuth)
router.get('/profile/:email',getUserProfile)
router.patch('/profile/update',updateUser)
router.post('/logOut',deleteCookieToken)

module.exports = router