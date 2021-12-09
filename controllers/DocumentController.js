const { User, DocumentType, DocumentExchange, DocumentFile, Document } = require('../models');
const { sequelize } = require('../models')
const { response } = require('express')
const Joi = require('@hapi/joi');
const { Op, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const url = require('url');
const { random } = require('lodash');
const PG = require('..//service/paginate')

module.exports.sentDocument = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    let search = queryObject.search;
    let from_user = req.user.user_id;
    try {
        let documents = await Document.findAll({
            include: [
                {
                    model: DocumentExchange,
                    as: 'exchange',
                    required: true,
                    include: [
                        {
                            model: User,
                            as: 'from',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                        {
                            model: User,
                            as: 'to',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                    ],
                    attributes: ['id', 'to_user_id', 'from_user_id', 'status', 'accept']
                },
                {
                    model: DocumentType,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                },

            ],
            where: {
                description: {
                    [Op.like]: `%${search || ''}%`
                },
                '$exchange.from_user_id$': req.user.user_id,
            },
            order: [
                ['id', 'DESC'],
            ],

        })
        req.data = documents
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        return res.json(error)
    }
}
module.exports.receivedDocument = async (req, res) => {
    let from_user = req.user.user_id;
    const queryObject = url.parse(req.url, true).query;
    let search = queryObject.search;
    try {
        let documents = await Document.findAll({
            include: [
                {
                    model: DocumentExchange,
                    as: 'exchange',
                    required: true,
                    include: [
                        {
                            model: User,
                            as: 'from',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                        {
                            model: User,
                            as: 'to',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                    ],
                    attributes: ['id', 'to_user_id', 'from_user_id', 'status', 'accept']
                },
                {
                    model: DocumentType,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                },

            ],
            where: {
                description: {
                    [Op.like]: `%${search || ''}%`
                },
                '$exchange.to_user_id$': req.user.user_id
            },
            order: [
                ['id', 'DESC'],
            ],
        })

        req.data = documents
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        return res.json(error)
    }
}
module.exports.create = async (req, res) => {
    const dateNow = new Date();
    // return res.send({ to: req.body.to_user });
    const transaction = await sequelize.transaction();
    try {
        const document = await Document.create({
            description: req.body.description,
            doc_name: req.body.name,
            type_id: req.body.type_id,
            date: `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`
        }, { transaction });

        for (let i = 0; i < req.body.to_user.length; i++) {
            await DocumentExchange.create({
                to_user_id: req.body.to_user[i],
                from_user_id: req.user.user_id,
                document_id: document.id,
                draft: req.body.draft || 0,
                status: 'waiting'
            }, { transaction });
        }
        if (!req.files) {
            res.send({ status: false, message: 'No file uploaded' });
            if (!req.files.files) {
                res.send({ status: false, message: 'No file uploaded' });
            }
        } else {
            let avatar = req.files.files;
            for (let i = 0; i < avatar.length; i++) {
                let url = './uploads/' + Math.floor(Math.random() * 1000) + avatar[i].name;
                avatar[i].mv(url)
                await DocumentFile.create({
                    file_name: avatar[i].name,
                    file_url: url,
                    document_id: document.id
                }, { transaction });
            }
        }

        await transaction.commit();
        res.status(201).send({ status: true, message: 'Document have send', });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({ message: err.message, line: err.line });
    }
};
module.exports.show = async (req, res) => {
    let from_user = req.user.user_id;
    try {
        await DocumentExchange.update({
            accept: true
        }, {
            where: {
                to_user_id: from_user,
                document_id: req.params.id
            }
        });
        let documents = await Document.findOne({
            include: [
                {
                    model: DocumentExchange,
                    as: 'exchange',
                    required: true,
                    include: [
                        {
                            model: User,
                            as: 'from',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                        {
                            model: User,
                            as: 'to',
                            required: true,
                            attributes: ['id', 'full_name']
                        },
                    ],
                    attributes: ['id', 'to_user_id', 'from_user_id', 'status', 'accept']
                },
                {
                    model: DocumentType,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                },
                {
                    model: DocumentFile,
                    as: 'files',
                    require: true,

                }

            ],
            where: { 'id': req.params.id },
        });
        let my_answer = await DocumentExchange.findOne({
            where: {
                to_user_id: req.user.user_id,
                document_id: req.params.id
            },
        })

        res.status(200).send({
            data: documents,
            my_answer
        })
    } catch (error) {
        return res.json(error)
    }
}
module.exports.answer = async (req, res) => {
    let status = req.body.status;
    await DocumentExchange.update({
        status: status
    }, {
        where: {
            document_id: req.params.id,
            to_user_id: req.user.user_id
        }
    })
    return res.status(200).json({ message: "Answer has accepted" })
}