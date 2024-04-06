"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
