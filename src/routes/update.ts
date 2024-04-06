import express, { Request, Response } from "express";
import Admin, { IAdmin } from "../models/adminModel";
import User, { IUser } from "../models/userModel";

const router = express.Router();


router.put("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.adminId;
        const updatedUserData: Partial<IUser> = req.body;

        const requiredFields = ["fname", "lname", "email", "phone", "password"];
        const missingFields = requiredFields.filter(field => !(field in updatedUserData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedUser= await Admin.findByIdAndUpdate(userId, updatedUserData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ Message: "User not found" });
        }

        res.json({ data: updatedUser });
    } catch (error) {
        console.error("Error updating user account", error);
        res.status(500).json({ Message: "Internal Server Error" });
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

  


export default router;