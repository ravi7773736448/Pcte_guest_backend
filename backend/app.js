const express = require('express');
const Admin = require('./models/AdminSchema');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectTOdb = require('./config/connect');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))

 

connectTOdb();


app.post("/api/admin/login")


app.listen(3000);