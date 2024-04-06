import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import Admin, { IAdmin } from "../models/adminModel";
import User from "../models/userModel";
import Review from "../models/reviewModel";

const router = express.Router();



router.put("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }

        const { fname, lname, email, phone } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fname) user.fname = fname;
        if (lname) user.lname = lname;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




router.put("/admin/:adminId", async (req: Request, res: Response) => {
    try {
        const adminId = req.params.adminId;
        const updatedAdminData: Partial<IAdmin> = req.body;

        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedAdminData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedAdmin= await Admin.findByIdAndUpdate(adminId, updatedAdminData, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ Message: "Admin not found" });
        }

        res.json({ data: updatedAdmin });
    } catch (error) {
        console.error("Error updating admin profile", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.put("/users/:userId/resetpassword", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }

        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting user password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.put("/reviews/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const { areaName, reviewContent, rating } = req.body;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (areaName) review.areaName = areaName;
        if (reviewContent) review.reviewContent = reviewContent;
        if (rating) review.rating = rating;

        await review.save();

        res.status(200).json({ message: "Review details updated successfully" });
    } catch (error) {
        console.error("Error updating review details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



export default router;