const mongoose = require('mongoose');
const Store    = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index', { title: "Home page"});
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add store'});
};

exports.createStore = async (req, res) => {
    const store     = await (new Store(req.body)).save();
    console.log('store saved, redirecting...');
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {

    // query database for all stores
    const stores = await Store.find();
    // console.log(stores);
    res.render('stores', { title: 'Stores', stores});
};

exports.editStore = async (req, res) => { // this renders the edit form
    // find store by id
    const store = await Store.findById({_id: req.params.id});
    // res.json(store);

    
    // TODO: check if owner of the store

    // render out the edit form for the user
    res.render('editStore', { title: `Edit ${store.name}`, store})

};

exports.updateStore = async (req, res) => { // this actually saves the edit
    // find and update store by id
    const store = await Store.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of the old one...
        runValidators: true
    });

    // redirect to store and tell user it worked...
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store →</a>`);
    res.redirect(`/stores/${store._id}/edit`);
};




