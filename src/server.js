const express = require('express');
const DbConnection = require('./db/index');
const userRouter = require("./routes/user.route");
const authRouter = require('./routes/auth.route');
const cors = require('cors');

// using dotenv
require('dotenv').config();

const server = express();
// Connect to Database
DbConnection();

server.use(cors());
server.use(express.json());
// app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

server.get('/api/v1', (req,res) => res.send("Welcome to Server!"));
server.use('/api/v1/user', userRouter );
server.use('/api/v1/auth', authRouter );

// PORT
const port = process.env.PORT || 5000;

server.listen(port,'localhost',()=>{
    console.log(`Server running on port: ${port}`);
})