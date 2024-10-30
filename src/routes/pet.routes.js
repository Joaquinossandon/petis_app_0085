const { verifyAccessApi } = require("../middleware/tokenVerify");
const petController = require("../controllers/pet.controller");
const { Router } = require("express");
const router = Router();

router.post("/api/user/pet", verifyAccessApi, petController.addToUser);

module.exports = router;
