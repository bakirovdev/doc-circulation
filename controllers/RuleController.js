const { User, Rule, UserRule } = require('../models')
const Joi = require('@hapi/joi')
const { Op } = require("sequelize");
const url = require('url');
const _ = require('lodash');
const { sequelize } = require('../models')
const { date } = require('joi');

module.exports.getUserRule = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    let user_id = queryObject.user_id;
    if (!req.user.user_id) {
        return res.status(409).send({
            message: "Ro'yxatdan o'ting",
        })
    }
    let user_rule = await UserRule.findAll({
        where: { user_id: user_id},
        attributes: ['rule_id'],
    });
    let rule_id = [];
    user_rule.forEach((element, index) => {
        rule_id.push(element.rule_id);
    });
    let rule = await Rule.findAll({
        where: { id: rule_id},
    })
    return res.send({data:rule}).status(200);
}
module.exports.getAllRule = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    if (!req.user.user_id) {
        return res.status(409).send({
            message: "Ro'yxatdan o'ting",
        })
    }
    let user_rule = await UserRule.findAll({
        where: { user_id:  queryObject.user_id ? queryObject.user_id : 0  },
        attributes: ['rule_id'],
    });
    let rule_id = [];
    user_rule.forEach((element, index) => {
        rule_id.push(element.rule_id);
    });
    let rule = await Rule.findAll({
        where: {
            id: { [Op.not]: rule_id },
            active: true
        },
    })
    return res.send({ data:rule }).status(200);
}
ruleValidation = (fields) => {
    const validatorSchema = {
        rule_id: Joi.array().required(),
        user_id: Joi.number().required(),
    }
    return Joi.validate(fields, validatorSchema);
}
module.exports.attachRule = async (req, res) => {
    let { rule_id, user_id } = req.body
    const transaction = await sequelize.transaction();
    try {
        const validator = ruleValidation(({ rule_id, user_id}))
        if (validator.error) {
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let a = []
        await rule_id.forEach((element, key) => {
            UserRule.create({
                rule_id:element,
                user_id:user_id,
            });
            // a.push(element)
        })
        // return res.send(a)
        res.send({message:"The rule has saved"}).status(200)
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        res.status(409).json({message: error.errors[0].message})
    }
}
module.exports.unAttachRule = async (req, res) => {
    let { rule_id, user_id } = req.body
    const transaction = await sequelize.transaction();
    try {
        const validator = ruleValidation(({ rule_id, user_id}))
        if (validator.error) {
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        await rule_id.forEach((element, key) => {
            UserRule.destroy({
                where: {
                    rule_id: element,
                    user_id: user_id,
                },    
            });    
        })
        await transaction.commit();
        return res.send({message:"The rule has removed"}).status(200)
    } catch (error) {
        await transaction.rollback();
        res.status(409).json({ message: error})
    }
}