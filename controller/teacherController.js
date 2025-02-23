const studentModel = require('../model/studentModel')
const teacherModel = require('../model/teacherModel')
const adminModel = require('../model/adminModel')
const fs = require('fs');
const sendMail = require('../helper/email');
const jwt = require('jsonwebtoken');
const signUp = require('../helper/signUp');
const bcrypt = require('bcryptjs');
const secret_key = process.env.JWT_SECRET;


