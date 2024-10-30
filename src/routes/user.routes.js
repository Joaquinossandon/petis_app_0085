const { verifyAccessApi } = require("../middleware/tokenVerify");
const userController = require("../controllers/user.controller");
const { Router } = require("express");

const router = Router();

router.post("/api/editUser/:idUser", verifyAccessApi, userController.edit);

module.exports = router;
