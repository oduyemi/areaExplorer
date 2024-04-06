"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dislikeSchema = new mongoose_1.default.Schema({
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviewID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Review",
        required: true
    }
});
const Dislike = mongoose_1.default.model("Dislike", dislikeSchema);
exports.default = Dislike;
