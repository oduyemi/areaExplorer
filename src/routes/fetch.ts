import express, { Request, Response } from "express";
import Admin, { IAdmin } from "../models/adminModel";
import User, { IUser } from "../models/userModel";
import Dashboard, { IDashboard } from "../models/dashboardModel";
import Review from "../models/reviewModel";

const router = express.Router();



router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Area Explorer!!" });
    });

router.get("/users", async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find();
        if (users.length === 0) {
            res.status(404).json({ Message: "Users not available" });
        } else {
            res.json({ data: users });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.adminId;
        const user: IUser | null = await User.findById(userId);
    
        if (!user) {
        res.status(404).json({ Message: "User not found" });
        } else {
        res.json({ data: user });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


router.get("/admin", async (req: Request, res: Response) => {
    try {
        const admins: IAdmin[] = await Admin.find();
        if (admins.length === 0) {
            res.status(404).json({ Message: "Admins not available" });
        } else {
            res.json({ data: admins });
        }
        } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

    
router.get("/admin/:adminId", async (req: Request, res: Response) => {
    try {
        const adminId = req.params.adminId;
        const admin: IAdmin | null = await Admin.findById(adminId);
    
        if (!admin) {
        res.status(404).json({ Message: "Admin not found" });
        } else {
        res.json({ data: admin });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});
        

router.get("/dashboard", async (req, res) => {
    try {
        const reviews = await Dashboard.find();

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found in the dashboard" });
        }

        res.json({ data: reviews });
    } catch (error) {
        console.error("Error fetching reviews from the dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/admin/dashboard", async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }

        const reviews = await Review.find();

        res.json({ data: reviews });
    } catch (error) {
        console.error("Error fetching reviews from the admin dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }

        res.json({ data: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/reviews/approved", async (req, res) => {
    try {
        const approvedReviews = await Review.find({ status: 'approved' });

        res.status(200).json(approvedReviews);
    } catch (error) {
        console.error("Error fetching approved reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get("/reviews/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ data: review });
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/admin/reviews/approved", async (req, res) => {
    try {
        const approvedReviews = await Review.find({ status: 'approved' });
        res.status(200).json(approvedReviews);
    } catch (error) {
        console.error("Error fetching approved reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/admin/reviews/declined", async (req, res) => {
    try {
        const declinedReviews = await Review.find({ status: 'declined' });
        res.status(200).json(declinedReviews);
    } catch (error) {
        console.error("Error fetching declined reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});







export default router;