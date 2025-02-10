"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController"); // import your controller methods
const router = express_1.default.Router();
// User signup
router.post("/signup", authController_1.signup);
// User login
router.post("/login", authController_1.login);
// User logout
router.post("/logout", authController_1.logout);
exports.default = router;
