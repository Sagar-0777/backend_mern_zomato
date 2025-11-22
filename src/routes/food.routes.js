const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');
const { route } = require('./auth.routes');

const upload = multer({
    storage: multer.memoryStorage(),
})

//post /api/food/ and it is protected
router.post('/', authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood)



//get /api/food/ will  be protected
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
)


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood
)

router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)

router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)




module.exports = router;