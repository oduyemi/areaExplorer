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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const likeModel_1 = __importDefault(require("../models/likeModel"));
const dislikeModel_1 = __importDefault(require("../models/dislikeModel"));
const router = express_1.default.Router();
require("dotenv").config();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newUser = new userModel_1.default({ fname, lname, email, phone, password: hashedPassword });
        yield newUser.save();
        // Access token
        const token = jsonwebtoken_1.default.sign({
            adminID: newUser._id,
            email: newUser.email
        }, process.env.JWT_SECRET);
        const userSession = {
            userID: newUser._id,
            fname,
            lname,
            email,
            phone
        };
        req.session.user = userSession;
        return res.status(201).json({
            message: "User registered successfully.",
            token,
            nextStep: "/next-login-page",
        });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Error registering user" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }
            const isPasswordMatch = yield (0, bcrypt_1.compare)(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
            const token = jsonwebtoken_1.default.sign({
                userID: user.userID,
                email: user.email
            }, process.env.JWT_SECRET || "default_secret");
            const userSession = {
                userID: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phone: user.phone,
            };
            req.session.user = userSession;
            return res.status(200).json({
                message: "User login successful!.",
                nextStep: "/next-dashboard",
                token,
            });
        }
        catch (error) {
            console.error("Error during user login:", error);
            return res.status(500).json({ message: "Error logging in user" });
        }
    }
    catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Error logging in user" });
    }
}));
router.post("/admin/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingAdmin = yield adminModel_1.default.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newAdmin = new adminModel_1.default({ fname, lname, email, phone, password: hashedPassword });
        yield newAdmin.save();
        // Access token
        const token = jsonwebtoken_1.default.sign({
            adminID: newAdmin._id,
            email: newAdmin.email
        }, process.env.JWT_SECRET);
        const adminSession = {
            adminID: newAdmin._id,
            fname,
            lname,
            email,
            phone
        };
        req.session.admin = adminSession;
        return res.status(201).json({
            message: "Admin registered successfully.",
            token,
            nextStep: "/next-admin-login-page",
        });
    }
    catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Error registering admin" });
    }
}));
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const admin = yield adminModel_1.default.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }
            const isPasswordMatch = yield (0, bcrypt_1.compare)(password, admin.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
            const token = jsonwebtoken_1.default.sign({
                adminID: admin._id,
                email: admin.email
            }, process.env.JWT_SECRET || "default_secret");
            const adminSession = {
                adminID: admin._id,
                fname: admin.fname,
                lname: admin.lname,
                email: admin.email,
                phone: admin.phone,
            };
            req.session.admin = adminSession;
            return res.status(200).json({
                message: "Admin login successful!.",
                nextStep: "/next-admin-dashboard",
                token,
            });
        }
        catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ message: "Error logging in admin" });
        }
    }
    catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({ message: "Error logging in admin" });
    }
}));
router.post("/review", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const { areaName, reviewContent, rating } = req.body;
        if (![areaName, reviewContent, rating].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newReview = new reviewModel_1.default({
            userID: req.session.user.userID,
            areaName,
            reviewContent,
            rating,
            status: "pending"
        });
        yield newReview.save();
        res.status(201).json({ message: "Review created successfully" });
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/reviews/rating", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const { reviewId, rating } = req.body;
        if (![reviewId, rating].every(field => field)) {
            return res.status(400).json({ message: "Both reviewId and rating are required" });
        }
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.status !== "approved") {
            return res.status(400).json({ message: "Cannot rate unapproved reviews" });
        }
        review.rating = rating;
        yield review.save();
        res.status(200).json({ message: "Review rating updated successfully" });
    }
    catch (error) {
        console.error("Error rating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/reviews/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const { reviewId } = req.body;
        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        const existingLike = yield likeModel_1.default.findOne({ userID: req.session.user.userID, reviewId });
        if (existingLike) {
            yield likeModel_1.default.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: "Like removed successfully" });
        }
        const newLike = new likeModel_1.default({ userID: req.session.user.userID, reviewId });
        yield newLike.save();
        res.status(201).json({ message: "Review liked successfully" });
    }
    catch (error) {
        console.error("Error liking review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/reviews/dislike", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const { reviewId } = req.body;
        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        const existingDislike = yield dislikeModel_1.default.findOne({ userID: req.session.user.userID, reviewId });
        if (existingDislike) {
            yield dislikeModel_1.default.deleteOne({ _id: existingDislike._id });
            return res.status(200).json({ message: "Dislike removed successfully" });
        }
        const newDislike = new dislikeModel_1.default({ userID: req.session.user.userID, reviewId });
        yield newDislike.save();
        res.status(201).json({ message: "Review disliked successfully" });
    }
    catch (error) {
        console.error("Error disliking review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/admin/reviews/:reviewId/approve", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        review.status = 'approved';
        yield review.save();
        res.status(200).json({ message: "Review approved successfully" });
    }
    catch (error) {
        console.error("Error approving review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/admin/reviews/:reviewId/decline", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        const review = yield reviewModel_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        review.status = 'declined';
        yield review.save();
        res.status(200).json({ message: "Review declined successfully" });
    }
    catch (error) {
        console.error("Error declining review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
