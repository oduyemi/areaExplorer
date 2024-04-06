import mongoose, { Schema, Document } from "mongoose";



export interface IDashboard extends Document {
  dashboardID: mongoose.Types.ObjectId;
  userID: mongoose.Types.ObjectId;
  reviewID: string;
}

const dashboardSchema: Schema = new mongoose.Schema({
  dashboardID: {
    type: String,
    required: true,
  },
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

const Dashboard = mongoose.model<IDashboard>("Dashboard", dashboardSchema);

export default Dashboard;
