const jwt = require('jsonwebtoken');
const adminModel = require('../model/adminModel');
const secret_key = process.env.JWT_SECRET;

// exports.checkLogins = async (req, res, next) => {
//     if(!req.headers.authorization){
//         return res.status(404).json({
//             message: "Kindly Login to perform this action"
//         })
//     }

//     const checkToken = req.headers.authorization.split(" ")[1]
   
//     const tokenOwner = await jwt.verify(checkToken, secret_key, (error, data)=>{
//         if(error){
//             return res.status(400).json({
//                 message: error.message
//             })
//         }
//         return data
//     })

//     const checkUser = await adminModel.findById(tokenOwner.id)
//     if(!checkUser){
//         return res.status(404).json({
//             message: "Admin Not Found"
//         })
//     }
// next();
// }