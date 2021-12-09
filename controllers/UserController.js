const { User } = require('../models')
const Joi = require('@hapi/joi')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')
const url = require('url');
module.exports.create = async (req, res) => {
    if (!req.user.user_id) {
        return res.status(409).send({
            message: "Ro'yxatdan o'ting",

        })
    }
    if (!await User.findOne({ where: { id: req.user.user_id } })) {
        res.status(403).send({ message: 'Ruxsat yo\'q' })
    }
    let auth_user = await User.findOne({ where: { id: req.user.user_id } })
    try {
        const { full_name, username, password } = req.body
        const validator = userValidation(({ full_name, username, password }))
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let hashPassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))
        const user = await User.create({
            full_name,
            username,
            password: hashPassword,
        })
        res.status(201).send({
            message: "Foydalanuvchi yaratildi",
            object: user
        })
    } catch (error) {
        res.status(409).json(error.message)
    }
}
userValidation = (fields) => {
    const validatorSchema = {
        full_name: Joi.string().required().min(3),
        username: Joi.string().required().min(3),
        password: Joi.string().required().min(3)
    }
    return Joi.validate(fields, validatorSchema);
}
module.exports.index = async (req, res) => {
    try {
        const queryObject = url.parse(req.url, true).query;
        const search = queryObject.search;
        let users = await User.findAll({
            attributes: {
                exclude: ['password'],
            },
            where: {
                full_name: {
                    [Op.like]: `%${search || ''}%`
                },
                id: { [Op.not]: req.user.user_id }
            }
        })
        // users = users.push({opened:true})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports.user = async (req, res) => {
    let auth_user = await User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: { id: req.user.user_id }
    })
    return res.status(200).send(auth_user)
}
module.exports.update = async (req, res) => {
    let auth_user = await User.findOne({ where: { id: req.user.user_id } })
    try {
        let { username, full_name, password } = req.body
        const validator = userValidation(({ full_name, username, password }))
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }

        password = await bcrypt.hash(req.body.password.toString(), await bcrypt.genSalt(10))
        const id = req.params.id
        let user = await User.update({
            username: username,
            full_name: full_name,
            password: password
        }, {
            where: { id: id }
        })
        res.status(200).send({
            message: "The user has updated",
            data: await User.findOne({ where: { id: id } })
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
module.exports.updateActive = async (req, res) => {
    let user = await User.findOne({ where: { id: req.params.id } })
    if (!user)
        return res.status(200).json({ message: "Bunday foydalanuvchi mavjud emas" })
    try {
        await User.update({
            active: !user.active
        }, {
            where: { id: req.params.id }
        })
        user = await User.findOne({ where: { id: req.params.id } })
        res.status(200).json({ data: user, message: "The user has updated" })
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports.delete = async (req, res) => {
    let user = await User.findOne({ where: { id: req.user.user_id } })
    if (!user.admin)
        return res.status(403).send("forbidden")
    try {
        user = await User.destroy({
            where: { id: req.params.id }
        })
        if (!user)
            return res.status(200).json({ message: "Bunday foydalanuvchi mavjud emas" })

        res.status(200).json({ message: "Foydalanuvchi o'chirildi" })
    } catch (error) {
        res.status(400).send(error.message)
    }
}