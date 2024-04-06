import mongoose, { Schema, Document } from "mongoose";

export interface IDislike extends Document {
  userID: mongoose.Types.ObjectId;
  reviewID: mongoose.Types.ObjectId;
}

const dislikeSchema: Schema = new mongoose.Schema({
  userID: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", 
     required: true },
     
  reviewID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Review", 
    required: true }
});

const Dislike = mongoose.model<IDislike>("Dislike", dislikeSchema);

export default Dislike;
