const {DocumentType, User} = require('../models')
const url = require('url');
const { Op } = require("sequelize");
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
var multer  =   require('multer');

module.exports.index = async (req, res) => {
    try {
        const queryObject = url.parse(req.url,true).query;
        const search = queryObject.search;
        let type = await DocumentType.findAll({
            where:{
                title: {
                    [Op.like]: `%${search || ''}%`
                }
            }
        })
        
        res.status(200).send(type)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports.getActive = async (req, res) => {
    try {
      
        let type = await DocumentType.findAll({
            where:{
               active:true
            }
        })
        
        res.status(200).send(type)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports.create = async (req, res) => {
    let auth_user = await User.findOne({ where: { id: req.user.user_id } })
    let {title} = req.body
    try {
        const validator = typeValidation(({ title}))
        if (validator.error) {
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let type = await DocumentType.create({
            title:req.body.title
        })
        res.status(201).send({
            message:"Document Type has created",
            object: type
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,            
        })
    }
}
module.exports.update = async (req, res) => {
    let auth_user = await User.findOne({ where: { id: req.user.user_id } })
    try {
        let {title} = req.body
        const validator = typeValidation(({ title }))
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        const id = req.params.id
        await DocumentType.update({
            title: title
        }, {
            where:{id: id}
        })
        res.status(200).send({
            message: "The user has updated"
        })
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}
module.exports.destroy = async (req, res) => {
    let auth_user = await User.findOne({ where: { id: req.user.user_id } })
    try {
        let type = await DocumentType.destroy({
            where: {
                id:req.params.id
            }
        })
        res.status(201).send({
            message:"Document Type has deleted",
            object: type
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,            
        })
    }
}
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
var upload = multer({ storage: storage }).array('files');
module.exports.document = async (req, res) => {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
}
typeValidation = (fields) => {
    const validatorSchema = {
        title:Joi.string().required().min(2)
    }
    return Joi.validate(fields, validatorSchema);
}
