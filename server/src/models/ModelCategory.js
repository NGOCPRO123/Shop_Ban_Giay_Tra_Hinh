const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { 
        type: String, 
        required: true,
        unique: true 
    },
    slug: { 
        type: String, 
        required: true,
        unique: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    parent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'categories',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('categories', categorySchema); 