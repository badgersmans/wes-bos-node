const express          = require('express');
const router           = express.Router();
const storeController  = require('../controllers/storeController');
const userController   = require('../controllers/userController');
const { catchErrors }  = require('../handlers/errorHandlers');

// Do work here
router
    .route('/')
    .get(catchErrors(storeController.getStores));


router
    .route('/stores')
    .get(catchErrors(storeController.getStores));
    

router
    .route('/stores/:id/edit')
    .get(catchErrors(storeController.editStore));


router
    .route('/add')
    .get(storeController.addStore)
    .post(
        storeController.upload,
        catchErrors(storeController.resizePhoto),
        catchErrors(storeController.createStore)
        );


router
    .route('/add/:id')
    .get(storeController.addStore)
    .post(
        storeController.upload,
        catchErrors(storeController.resizePhoto),
        catchErrors(storeController.updateStore)
        );

router
    .route('/store/:slug')
    .get(catchErrors(storeController.getStoreBySlug))

router
    .route('/tags')
    .get(catchErrors(storeController.getStoresByTag))

router
    .route('/tags/:tag')
    .get(catchErrors(storeController.getStoresByTag))

router.route('/login').get(userController.loginForm);

router
    .route('/register')
    .get(userController.registerForm)
    
    // 1. validate data
    // 2. register the user
    // 3. log them in after register
    .post(userController.registerValidator, userController.register);


// router.get('/'      , catchErrors(storeController.getStores));
// router.get('/stores', catchErrors(storeController.getStores));
// router.get('/add'   , storeController.addStore);
// router.post('/add'  , catchErrors(storeController.createStore));

module.exports = router;
