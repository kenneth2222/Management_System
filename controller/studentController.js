const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;
const studentModel = require('../model/studentModel');

exports.getOneStudent = async (req, res)=>{
    try {
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

        const {id} = req.params;

        //If the token owner is not the same as the id in the parameter, it will return an error
        if(tokenOwner.id !== id){
            return res.status(404).json({
                message: "You are not authorized to perform this action"
            })
        }

        const student = await studentModel.findById(id);

        if(!student){
            return res.status(404).json({
                message: "Student Not Found"
            })
        }
        return res.status(200).json({
            message: "Student Found",
            data: student
        })
    } catch (error) {
        res.status(500).json({    
            message: "Internal Server Error",
            error: error.message
        })
    }
}