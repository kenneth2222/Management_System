const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;
const adminModel = require('../model/adminModel');
const teacherModel = require('../model/teacherModel');


exports.checkRole = async (req, res, next) => {
    //Checks if the Authorization header is present in the HTTP request
    if(!req.headers.authorization){
        return res.status(404).json({
            message: "Kindly Login to perform this action"
        })
    }

    //This will extract the token from the authorization header
    const checkToken = req.headers.authorization.split(" ")[1]
  
    const tokenOwner = await jwt.verify(checkToken, secret_key, (error, data)=>{
        if(error){
            return res.status(400).json({
                message: error.message
            })
        }
        return data
    })

    const checkAdmin = await adminModel.findById(tokenOwner.id)
    const checkTeacher = await teacherModel.findById(tokenOwner.id)

    console.log(checkAdmin, `I am Admin`)
    console.log(checkTeacher, `I am a Teacher`)

    if(!checkAdmin || !checkTeacher){
        return res.status(404).json({
            message: "Admin or Teacher Not Found"
        })
    }else if(checkAdmin.isSuperAdmin === true || checkTeacher.isAdmin === true){
        next();
       
    }else {
        return res.status(401).json({
            message: "Your are not authorized to perform this action"
        })
    }

}
exports.adminRole = async (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(404).json({
            message: "Kindly Login to perform this action"
        })
    }

    const checkToken = req.headers.authorization.split(" ")[1]
    // if(!checkToken){
    //     return res.status(404).json({
    //         message: "Kindly Login to perform this action"
    //     })
    // }
    const  tokenOwner = await jwt.verify(checkToken, secret_key, (error, data)=>{
        if(error){
            return res.status(400).json({
                message: error.message
            })
        }
        return data
    })

    const checkAdmin = await adminModel.findById(tokenOwner.id)
    if(!checkAdmin){
        return res.status(404).json({
            message: "Admin Not Found"
        })
    }else if(checkAdmin.isSuperAdmin === true){
        next();
       
    }else {
        return res.status(401).json({
            message: "Your are not authorized to perform this action"
        })
    }

}