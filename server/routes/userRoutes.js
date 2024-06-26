const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");

const { registerUser, loginUser, getMe, getUser, forgotPassword, checkUserExistance, getResetPassword, postResetPassword, updateUser, deleteUser } = require("../controllers/userController");

router.get("/user", getUser);
router.get("/reset-password/:id/:token", getResetPassword);
router.post("/reset-password/:id/:token", postResetPassword);
router.post("/register", registerUser);
router.post("/userCheck", checkUserExistance)
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/me", auth, getMe);
router.put("/updateUser/:userId", updateUser);
router.delete("/deleteUser/:userId", deleteUser);
module.exports = router;
