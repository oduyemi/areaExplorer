import mongoose, { Schema, Document } from "mongoose";



export interface IReview extends Document {
  reviewID: mongoose.Types.ObjectId;
  userID: mongoose.Types.ObjectId;
  areaName: string;
  reviewContent: string;
  rating: string;
  status: 'pending' | 'approved' | "declined";
  date: Date;
}

const reviewSchema: Schema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true
  },
  areaName: {
    type: String,
    required: true,
  },
  reviewContent: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', "declined"],
    required: true,
  },
  date: { 
    type: Date, default: Date.now 
  },
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
