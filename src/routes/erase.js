"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
router.delete("/reviews/:reviewId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        const reviewUserID = mongoose_1.Types.ObjectId.isValid(review.userID) ? review.userID.toString() : review.userID;
        if (reviewUserID !== req.session.user.userID) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this review" });
        }
        yield reviewModel_1.default.findByIdAndDelete(reviewId);
        res.status(200).json({ message: "Review deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.delete("/users/:userId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield userModel_1.default.findByIdAndDelete(userId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "User account deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.delete("/admin/:adminId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminId) {
            return res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
        }
        const admin = yield adminModel_1.default.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        yield adminModel_1.default.findByIdAndDelete(adminId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "Admin account deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting admin account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
