const mongoose        = require('mongoose');
const Store           = mongoose.model('Store');
const multer          = require("multer");
const jimp            = require('jimp');
const uuid            = require('uuid');

const multerOptions   = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: `Please upload an image!`}, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index', { title: "Home page"});
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add store'});
};

exports.upload      = multer(multerOptions).single('photo');

exports.resizePhoto = async(req, res, next) => {
    // check if there is no new file to resize
    if(!req.file) {
        next(); // skip to next middleware
        return;
    }
    // console.log(req.file);
    const fileExtension = req.file.mimetype.split('/')[1];
    req.body.photo      = `${uuid.v4()}.${fileExtension}`;

    // resize photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);

    // keep going after writing photo to disk!
    next();
};

exports.createStore = async(req, res) => {
    const store     = await (new Store(req.body)).save();
    console.log('store saved, redirecting...');
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req, res) => {

    // query database for all stores
    const stores = await Store.find();
    // console.log(stores);
    res.render('stores', { title: 'Stores', stores});
};

exports.editStore = async(req, res) => { // this renders the edit form
    // find store by id
    const store = await Store.findById({_id: req.params.id});
    // res.json(store);

    
    // TODO: check if owner of the store

    // render out the edit form for the user
    res.render('editStore', { title: `Edit ${store.name}`, store})

};

exports.updateStore = async(req, res) => { // this actually saves the edit
    
    // set the location data to be a point
    req.body.location.type = 'Point';

    // find and update store by id
    const store = await Store.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of the old one...
        runValidators: true
    });

    // redirect to store and tell user it worked...
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store →</a>`);
    res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async(req, res, next) => {

    // query database...
    const store = await Store.findOne({slug: req.params.slug});

    if(!store) return next();

    res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async(req, res) => {
    const tag      = req.params.tag;
    const tagQuery = tag || { $exists: true };

    const tagsPromise    = Store.getTagsList();
    const storesPromise  = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([ tagsPromise, storesPromise]);
    
    res.render('tag', 
        {
            tags,
            stores,
            title: 'Tags',
            tag
        }
    );
};




