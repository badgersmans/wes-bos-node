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
    },
    photo: String
}, { timestamps: true });

storeSchema.pre('save', async function(next) {

    if(!this.isModified('name')) {
        next();
        return; // stop function from running
    }

    this.slug = slug(this.name);

    // find other stores that have slug of store, store-1, store-2...etc...
    const slugRegex      = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    console.log(`slugregex is? ${slugRegex}`);
    const storesWithSlug = await this.constructor.find({slug: slugRegex});

    if(storesWithSlug.length) { //if there was a store with matching slug...
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`; // then override the slug...
    }
    next();
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

module.exports = mongoose.model('Store', storeSchema);