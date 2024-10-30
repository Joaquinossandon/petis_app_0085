const authController = require("../controllers/auth.controller");
const { Router } = require("express");

const router = Router();

router.post("/api/signup", authController.signUp);

router.post("/api/signin", authController.signIn);

router.get("/api/signout", authController.signOut);

module.exports = router;
