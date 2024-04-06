import express, { Request, Response } from "express";
import Review from "../models/reviewModel";


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

        if (review.userID.toString() !== req.session.user.userID) {
            return res.status(403).json({ message: "Forbidden: User is not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;




export default router;