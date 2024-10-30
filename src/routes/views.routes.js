const viewsController = require("../controllers/views.controllers");
const { verifyAccessView } = require("../middleware/tokenVerify");
const protectAdmin = require("../middleware/protectAdmin");
const { Router } = require("express");

const router = Router();

router.get("/", viewsController.home);

router.get("/login", verifyAccessView, viewsController.login);

router.get("/register", verifyAccessView, viewsController.register);

router.get("/agregar", verifyAccessView, viewsController.addPet);

router.get(
    "/admin/users",
    verifyAccessView,
    protectAdmin,
    viewsController.adminUsers
);

router.get(
    "/admin/users/:idUser",
    verifyAccessView,
    protectAdmin,
    viewsController.editUser
);

router.get(
    "/admin/users/:idUser/addPet",
    verifyAccessView,
    protectAdmin,
    viewsController.adminAddPet
);

module.exports = router;
