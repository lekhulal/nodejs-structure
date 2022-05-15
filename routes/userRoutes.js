const express = require("express")
const router = express.Router()
const { isAuth, hasRouteAccess } = require("../middleware/authMiddleware")

const {
    getAllUsers,
    getSingleUser,
    updatedMyAccount,
    myAccount,
    changePassword,
    updateUser
} = require("../controllers/userController")

router.get("/", isAuth, hasRouteAccess('admin'), getAllUsers)
router.patch("/:id", isAuth, hasRouteAccess('admin'), updateUser)
router.get("/myaccount", isAuth, myAccount)
router.patch("/update-myaccount", isAuth, updatedMyAccount)
router.patch("/change-password", isAuth, changePassword)
router.get("/:id", isAuth, hasRouteAccess('admin'), getSingleUser)


module.exports = router