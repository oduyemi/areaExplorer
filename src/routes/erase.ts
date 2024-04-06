import express, { Request, Response } from "express";
import { Types } from "mongoose";
import Review, { IReview } from "../models/reviewModel";
import Admin from "../models/adminModel";
import User from "../models/userModel";


const router = express.Router();



router.delete("/reviews/:reviewId/delete", async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const reviewUserID = Types.ObjectId.isValid(review.userID) ? review.userID.toString() : review.userID;
        if (reviewUserID !== req.session.user.userID) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/users/:userId/delete", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/admin/:adminId/delete", async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (!req.session.admin || req.session.admin.adminID.toString() !== adminId) {
            return res.status(401).json({ message: "Unauthorized: Admin not logged in or unauthorized to perform this action" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await Admin.findByIdAndDelete(adminId);
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
        });
        res.status(200).json({ message: "Admin account deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin account:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





export default router;