const studentModel = require('../model/studentModel')
const teacherModel = require('../model/teacherModel')
const adminModel = require('../model/adminModel')
const fs = require('fs');
const sendMail = require('../helper/email');
const jwt = require('jsonwebtoken');
const signUp = require('../helper/signUp');
const bcrypt = require('bcryptjs');
const secret_key = process.env.JWT_SECRET;


exports.createStudent = async (req, res)=>{
    try {
        
        const {fullName, gender, password, email, phoneNumber, } =req.body

        if(!fullName || !gender || !password || !email || !phoneNumber){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const checkUser = await studentModel.findOne({email: email.toLowerCase()})
        if(checkUser){
            return res.status(400).json({
                message: "Student Already Exists"
            })
        }
        
      
        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));



        const data = {
            fullName,
            gender,
            password: hash,
            email: email.toLowerCase(), 
            phoneNumber
        }
    

        const newData = await studentModel.create(data);

        //The word "secret_key" is self-defined, actually hidden in the .env file
        const token = await jwt.sign({id:newData._id}, secret_key, {expiresIn: '30m'})
        // console.log(token)
        const link = `${req.protocol}://${req.get('host')}/mail/${newData._id}/${token}`
        //console.log(link)
        const subject = "Welcome" + " " + fullName;
        const text = `Welcome ${newData.fullName}, Kindly use this link to verify your email ${link}`;
        await sendMail({ subject: subject, email: newData.email, html:signUp(link, newData.fullName) })
            return res.status(201).json({
            message: "New Student Created Successfully",
            data: newData
        })

    } catch(error) {
     res.status(500).json({
        message: error.message
     })   
    }
}

exports.createTeacher = async (req, res)=>{
    try {
        // console.log(req);
        const {fullName, password, email } =req.body

        if(!fullName || !password || !email ){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const checkUser = await teacherModel.findOne({email: email.toLowerCase()})
        if(checkUser){
            return res.status(400).json({
                message: "Teacher Already Exists"
            })
        }
        
        

        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));


// Store hash in your password DB.
        const data = {
            fullName,
            password: hash,
            email: email.toLowerCase(), 
        }
        
        

        const newData = await teacherModel.create(data);

        //The word "secret_key" is self-defined, actually hidden in the .env file
        const token = await jwt.sign({id:newData._id}, secret_key, {expiresIn: '15m'})
        // console.log(token)
        const link = `${req.protocol}://${req.get('host')}/mail/${newData._id}/${token}`
        //console.log(link)
        const subject = "Welcome" + " " + fullName;
        const text = `Welcome ${newData.fullName}, Kindly use this link to verify your email ${link}`;
        await sendMail({ subject: subject, email: newData.email, html:signUp(link, newData.fullName) })
            return res.status(201).json({
            message: "New Teacher Created Successfully",
            data: newData
        })

    } catch(error) {
     res.status(500).json({
        message: error.message
     })   
    }
}

exports.createAdmin = async (req, res)=>{
    try {
        // console.log(req);
        const {fullName, password, email, phoneNumber, } =req.body

        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Store hash in your password DB.
        const data = {
            fullName,
            password: hash,
            email: email.toLowerCase(), 
            phoneNumber
        }
        
        const newData = await adminModel.create(data);

        //The word "secret_key" is self-defined, actually hidden in the .env file
        const token = await jwt.sign({id:newData._id}, secret_key, {expiresIn: '15mins'})
     return res.status(201).json({
            message: "New Admin Created Successfully",
            data: newData
        })

    } catch(error) {
     res.status(500).json({
        message: error.message
     })   
    }
}


exports.userLogin = async (req, res) => {
    try {
        const { email, passWord } = req.body;
        let user;
        let userRole;

        if (await adminModel.findOne({ email: email.toLowerCase() })) {
            user = await adminModel.findOne({ email: email.toLowerCase() });
            userRole = 'Admin';
        } else if (await teacherModel.findOne({ email: email.toLowerCase() })) {
            user = await teacherModel.findOne({ email: email.toLowerCase() });
            userRole = 'Teacher';
        } else if (await studentModel.findOne({ email: email.toLowerCase() })) {
            user = await studentModel.findOne({ email: email.toLowerCase() });
            userRole = 'Student';
        }

        
        if (!user) {
            return res.status(404).json({
                message: "Email not found"
            });
        }

        // Check if password is correct
        const passwordCorrect = await bcrypt.compare(passWord, user.password);
        if (!passwordCorrect) {
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }

        
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Email not Verified"
            });
        }

        const token = await jwt.sign({ id: user._id }, secret_key, { expiresIn: '24h' });

        
        const { password, ...userData } = user._doc;

        return res.status(200).json({
            message: `Login Successful as ${userRole}`,
            data: userData,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to Login: " + error.message
        });
    }
};

exports.verifyMail = async (req, res) => {
    try{

        const { id, token } = req.params;
        let user;
        let userRole;

        // const checkuser = await schoolModel.findById( id )
        if(await adminModel.findById(id)){
            user = await adminModel.findById(id);
            userRole = 'Admin';
        } else if(await teacherModel.findById(id)){
            user = await teacherModel.findById(id);
            userRole = 'Teacher';
        } else if(await studentModel.findById(id)){
            user = await studentModel.findById(id);
            userRole = 'Student';
        }

       if(user.isVerified == true){
        return res.status(400).json({message: "Email already been verified"})
       }

       //With this method, The verification status might get updated even if the token is invalid or expired, leading to security risks.
    //  await jwt.verify(token, secret_key, (error)=>{
    //     if(error){
    //         return res.status(404).json({
    //             message: "Email Link Has Expired"
    //         })   
    //     }
    //  } )

     try {
        await jwt.verify(token, secret_key);
    } catch (error) {
        return res.status(404).json({
            message: "Email Link Has Expired"
        });
    }


     await user.updateOne({ isVerified: true });
        // const verifyingMail = await user.findByIdAndUpdate(id, {isVerified:true})
        res.status(200).json({
            message: `${userRole} email verified successfully`
        })
    }catch(error){
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error: " + error.message
        });
    }
}

exports.getAllStudents = async (req, res) => {
    try {
        const allStudents = await studentModel.find()
        res.status(200).json({
            message: `All Students in database`,
            data: allStudents
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
} 

exports.getAllTeachers = async (req, res) => {
    try {
        const allTeachers = await teacherModel.find()
        res.status(200).json({
            message: `All Teachers available in database`,
            data: allTeachers
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
}



exports.updateStudent = async (req, res) =>{
    try{
        const {id} = req.params;
        const findStudent = await studentModel.findById(id);

        if(!findStudent){
            return res.status(404).json({
                message: "Student Not Found"
            })
        }


        const studentUpdate = await studentModel.findByIdAndUpdate(id, req.body, {new: true})
        return res.status(200).json({
            message: "Student Successfully Updated",
            data: studentUpdate
        })
    }catch(err){
        res.status(500).json({
            message: "Internal Server Error" + err.message,

        })
    }
}

exports.updateTeacher = async (req, res) =>{
    try{
        const {id} = req.params;
        const findTeacher = await teacherModel.findById(id);

        if(!findTeacher){
            return res.status(404).json({
                message: "Teacher Not Found"
            })
        }

        const teacherUpdate = await teacherModel.findByIdAndUpdate(id, req.body, {new: true})
        return res.status(200).json({
            message: "Teacher Successfully Updated",
            data: teacherUpdate
        })
    }catch(err){
        res.status(500).json({
            message: "Internal Server Error" + err.message,

        })
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the student exists
        const findStudent = await studentModel.findById(id);
        if (!findStudent) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        // Delete the student
        await studentModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Student Successfully Deleted"
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error: " + err.message,
        });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the student exists
        const findTeacher = await teacherModel.findById(id);
        if (!findTeacher) {
            return res.status(404).json({
                message: "Teacher Not Found"
            });
        }

        // Delete the student
        await teacherModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Teacher Successfully Deleted"
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error: " + err.message,
        });
    }
};
 