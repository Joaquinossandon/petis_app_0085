const { Router } = require("express");
const authRoutes = require("./auth.routes");
const petRoutes = require("./pet.routes");
const userRoutes = require("./user.routes");
const viewsRoutes = require("./views.routes");

const router = Router();

router.use(authRoutes);
router.use(viewsRoutes);
router.use(petRoutes);
router.use(userRoutes);

module.exports = router;
