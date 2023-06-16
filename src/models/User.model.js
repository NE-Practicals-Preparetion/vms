const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 13,
    },
    nationalId: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024, // Passwords will be hashed and stored securely
    },
    userRoles: {
        type: String,
        enum: ['vehicle owner', 'system admin'],
        default: 'vehicle owner',
        required: true,
    },
});

// create Use model
const User = mongoose.model('User', userSchema);


const validateUser = (user) => {
    const schema = Joi.object({
        names: Joi.
            string().
            min(6).
            max(255).
            required(),
        email: Joi.
            string().
            email().
            min(5).
            max(255).
            required(),
        phone: Joi.string()
            .pattern(/^(\+250)\d{9}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must start with "+250" and be followed by 9 digits',
            }),
        nationalId: Joi.string()
            .length(16)
            .pattern(/^\d+$/)
            .required()
            .messages({
                'string.length': 'National ID must be exactly 16 digits',
                'string.pattern.base': 'National ID must contain digits only',
            }),
        password: Joi.
            string().
            min(8).
            max(255).
            required(),
        userRoles: Joi
            .string()
            .valid('vehicle owner', 'system admin')
            .required(),
    })
    return schema.validate(user);
}

module.exports = { User, validateUser };