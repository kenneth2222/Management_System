const adminRouter = require ('express').Router()

const {createStudent, createAdmin, userLogin, createTeacher, getAllTeachers, getAllStudents, updateStudent, updateTeacher, deleteTeacher, deleteStudent, verifyMail} = require ('../controller/adminController');
const {checkRole, adminRole} = require('../middleware/authorization')



adminRouter.post('/student', adminRole, createStudent);
adminRouter.post('/teacher', adminRole, createTeacher);
adminRouter.post('/admin', adminRole, createAdmin);
adminRouter.post('/login', userLogin)
adminRouter.get('/students', checkRole, getAllStudents)
adminRouter.get('/teachers', adminRole, getAllTeachers)
adminRouter.put('/student/:id', checkRole, updateStudent)
adminRouter.put('/teacher/:id', adminRole, updateTeacher)
adminRouter.delete('/teacher/:id', adminRole, deleteTeacher)
adminRouter.delete('/student/:id', adminRole, deleteStudent)
adminRouter.get('/mail/:id/:token', verifyMail)

module.exports = adminRouter;