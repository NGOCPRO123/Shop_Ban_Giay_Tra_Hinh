const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelProduct = new Schema({
    img: [{ type: String, default: '' }],
    name: { type: String, default: '' },
    price: { type: Number, default: 0 },
    slug: { type: String, default: '' },
    description: { type: String, default: '' },
    type: { type: Number, default: 0 },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('products', modelProduct);
