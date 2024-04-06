import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hash, compare } from "bcrypt";
import mongoose from "mongoose";
import Admin, { IAdmin } from "../models/adminModel";
import User, { IUser } from "../models/userModel";
import Review, { IReview } from "../models/reviewModel";
import Like, { ILike } from "../models/likeModel"
import Dislike, { IDislike } from "../models/dislikeModel"

const router = express.Router();


require("dotenv").config();

interface UserSession {
    userID: mongoose.Types.ObjectId; 
    fname: string;
    lname: string;
    email: string;
    phone: string;
}


interface AdminSession {
    adminID: mongoose.Types.ObjectId; 
    fname: string;
    lname: string;
    email: string;
    phone: string;
}
  

declare module "express-session" {
    interface SessionData {
        user?: UserSession; 
        admin?: AdminSession; 
    }
}


router.post("/register", async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const newUser: IUser = new User({ fname, lname, email, phone, password: hashedPassword }) as IUser;
        await newUser.save();

        // Access token
        const token = jwt.sign(
            {
                adminID: newUser._id, 
                email: newUser.email
            },
            process.env.JWT_SECRET!,
        );

        const userSession: UserSession = {
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
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Error registering user" });
    }
});


   
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const user: IUser | null = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }

            const isPasswordMatch = await compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }

            const token = jwt.sign(
                {
                    userID: user.userID,
                    email: user.email
                },
                process.env.JWT_SECRET || "default_secret",
            );

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
        } catch (error) {
            console.error("Error during user login:", error);
            return res.status(500).json({ message: "Error logging in user" });
        }
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Error logging in user" });
    }
});

router.post("/admin/register", async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, phone, password, cpwd } = req.body;
        if (![fname, lname, email, phone, password, cpwd].every((field) => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== cpwd) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const newAdmin: IAdmin = new Admin({ fname, lname, email, phone, password: hashedPassword }) as IAdmin;
        await newAdmin.save();

        // Access token
        const token = jwt.sign(
            {
                adminID: newAdmin._id, 
                email: newAdmin.email
            },
            process.env.JWT_SECRET!,
        );

        const adminSession: AdminSession = {
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
    } catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Error registering admin" });
    }
});


   
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const admin: IAdmin | null = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: "Email not registered. Please register first." });
            }

            const isPasswordMatch = await compare(password, admin.password);

            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }

            const token = jwt.sign(
                {
                    adminID: admin._id,
                    email: admin.email
                },
                process.env.JWT_SECRET || "default_secret",
            );

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
        } catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ message: "Error logging in admin" });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({ message: "Error logging in admin" });
    }
});

router.post("/review", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const { areaName, reviewContent, rating } = req.body;

        if (![areaName, reviewContent, rating].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReview = new Review({
            userID: req.session.user.userID,
            areaName,
            reviewContent,
            rating,
            status: "pending" 
        });

        await newReview.save();

        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/reviews/rating", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const { reviewId, rating } = req.body;

        if (![reviewId, rating].every(field => field)) {
            return res.status(400).json({ message: "Both reviewId and rating are required" });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.status !== "approved") {
            return res.status(400).json({ message: "Cannot rate unapproved reviews" });
        }

        review.rating = rating;

        await review.save();

        res.status(200).json({ message: "Review rating updated successfully" });
    } catch (error) {
        console.error("Error rating review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/reviews/like", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const { reviewId } = req.body;

        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const existingLike = await Like.findOne({ userID: req.session.user.userID, reviewId });
        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: "Like removed successfully" });
        }

        const newLike = new Like({ userID: req.session.user.userID, reviewId });
        await newLike.save();

        res.status(201).json({ message: "Review liked successfully" });
    } catch (error) {
        console.error("Error liking review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/reviews/dislike", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const { reviewId } = req.body;

        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const existingDislike = await Dislike.findOne({ userID: req.session.user.userID, reviewId });
        if (existingDislike) {
            await Dislike.deleteOne({ _id: existingDislike._id });
            return res.status(200).json({ message: "Dislike removed successfully" });
        }

        const newDislike = new Dislike({ userID: req.session.user.userID, reviewId });
        await newDislike.save();

        res.status(201).json({ message: "Review disliked successfully" });
    } catch (error) {
        console.error("Error disliking review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/admin/reviews/:reviewId/approve", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.status = 'approved';
        await review.save();

        res.status(200).json({ message: "Review approved successfully" });
    } catch (error) {
        console.error("Error approving review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/admin/reviews/:reviewId/decline", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.status = 'declined';
        await review.save();

        res.status(200).json({ message: "Review declined successfully" });
    } catch (error) {
        console.error("Error declining review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});






export default router;