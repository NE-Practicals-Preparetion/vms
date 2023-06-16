const express = require('express');
const { getUsers,createUser,getUserById,updateUser,deleteUser } =require('../controllers/User.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.get('/',authMiddleware,getUsers);
userRouter.post('/create-user',createUser);
userRouter.get('/:id',getUserById);
userRouter.put('/:id',updateUser);
userRouter.delete('/delete/:id',deleteUser);

module.exports = userRouter;