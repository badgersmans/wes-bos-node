const express          = require('express');
const router           = express.Router();
const storeController  = require('../controllers/storeController');
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
    .post(catchErrors(storeController.createStore));


router
    .route('/add/:id')
    .get(storeController.addStore)
    .post(catchErrors(storeController.updateStore));


// router.get('/'      , catchErrors(storeController.getStores));
// router.get('/stores', catchErrors(storeController.getStores));
// router.get('/add'   , storeController.addStore);
// router.post('/add'  , catchErrors(storeController.createStore));

module.exports = router;
