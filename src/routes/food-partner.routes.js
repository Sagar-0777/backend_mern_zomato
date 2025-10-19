const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();
const foodPartnerController = require("../controllers/food-partner.controller");

// GET /api/food-partner/:id (protected route)
router.get(
    "/:id",
    authUserMiddleware,
    foodPartnerController.getFoodPartnerById
);

module.exports = router;
