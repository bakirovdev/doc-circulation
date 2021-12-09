const { User, DocumentType, DocumentExchange, DocumentFile, Document, DocumentChat } = require('../models');
const { sequelize } = require('../models')
const { response } = require('express')
const Joi = require('@hapi/joi');
const { Op, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const url = require('url');
const { random } = require('lodash');

module.exports.index = async (req, res) => {
    let from_user = req.user.user_id;
    try {
        let chat = await DocumentChat.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    required: true,
                    attributes: ['id', 'full_name']
                }
            ],
            where: { document_id: req.params.id }
        })
        return res.status(200).json({ data: chat })
    } catch (error) {
        return res.json(error)
    }
}

module.exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        if (req.files && req.files.file) {
            let avatar = req.files.file;
            var url = './uploads/' + Math.floor(Math.random() * 1000) + avatar.name;
            avatar.mv(url);
        }
        let message = await DocumentChat.create({
            file_url: url || '',
            description: req.body.description,
            user_id: req.user.user_id,
            document_id: req.body.document_id
        }, { transaction })
        await transaction.commit();

        return res.status(200).json({ message: "Message has saved", data: message })
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({ message: err.message, line: err.line });
    }
};
module.exports.show = async (req, res) => {
    try {
    } catch (error) {
        return res.json(error)
    }
}