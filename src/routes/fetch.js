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
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dashboardModel_1 = __importDefault(require("../models/dashboardModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Area Explorer!!" });
});
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        if (users.length === 0) {
            res.status(404).json({ Message: "Users not available" });
        }
        else {
            res.json({ data: users });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.adminId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ Message: "User not found" });
        }
        else {
            res.json({ data: user });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield adminModel_1.default.find();
        if (admins.length === 0) {
            res.status(404).json({ Message: "Admins not available" });
        }
        else {
            res.json({ data: admins });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/admin/:adminId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const admin = yield adminModel_1.default.findById(adminId);
        if (!admin) {
            res.status(404).json({ Message: "Admin not found" });
        }
        else {
            res.json({ data: admin });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}));
router.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield dashboardModel_1.default.find();
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found in the dashboard" });
        }
        res.json({ data: reviews });
    }
    catch (error) {
        console.error("Error fetching reviews from the dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/admin/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.admin) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        const reviews = yield reviewModel_1.default.find();
        res.json({ data: reviews });
    }
    catch (error) {
        console.error("Error fetching reviews from the admin dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.default.find();
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.json({ data: reviews });
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/reviews/:reviewId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json({ data: review });
    }
    catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
