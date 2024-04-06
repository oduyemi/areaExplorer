import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  userID: mongoose.Types.ObjectId;
  reviewID: mongoose.Types.ObjectId;
}

const likeSchema: Schema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
        },
    reviewID: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Review", 
         required: true
        }
});

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;
