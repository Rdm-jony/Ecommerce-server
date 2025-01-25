const express = require('express');
const { addUsers, checkIsAdmin, jwtAuth, deleteCookieToken } = require('../Controller/user.controller');
const router = express.Router()

router.put("/", addUsers)
router.get("/admin/:email", checkIsAdmin)
router.post('/jwt/:email',jwtAuth)
router.post('/logOut',deleteCookieToken)

module.exports = router