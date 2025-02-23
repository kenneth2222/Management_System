const studentRouter = require ('express').Router()
const {getOneStudent} = require ('../controller/studentController');


// adminRouter.post('/student/:id', checkLogins, createStudent);
studentRouter.get('/student/:id', getOneStudent);

module.exports = studentRouter;