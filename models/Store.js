const mongoose   = require('mongoose');
const slug       = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter a store name!']
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [
            {
                type: Number,
                required: [true, 'Coordinates are required!']
            }
        ],
        address: {
            type: String,
            required: [true, 'Address is required']
        }
    }
}, { timestamps: true });

storeSchema.pre('save', function(next) {
    if(!this.isModified('name')) {
        next();
        return; // stop function from running
    }
    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('Store', storeSchema);