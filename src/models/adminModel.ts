import mongoose, { Schema, Document } from "mongoose";



export interface IAdmin extends Document {
  adminID: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
}


const adminSchema: Schema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
