const express = require('express');
const { login} = require('../controllers/User.controller');

const authRouter = express.Router();

authRouter.post('/login',login);

module.exports = authRouter;