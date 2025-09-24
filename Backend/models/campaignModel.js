import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: {
      type: String,
      enum: [
        "Education",
        "Medical",
        "Charity",
        "Technology",
        "Arts",
        "Environment",
        "Community",
        "Other",
      ],
      required: true,
    },

    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },

    deadline: { type: Date, required: true },

    location: {
      type: String, // you can replace with { lat: Number, lng: Number }
    },

    media: {
      images: [String], // Cloudinary image URLs
      video: String,    // Cloudinary video URL
    },

    rewards: [
      {
        amount: { type: Number, required: true },
        title: { type: String, required: true },
        description: String,
        deliveryDate: Date,
      },
    ],

    backers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],

    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    status: {
      type: String,
      enum: ["active", "funded", "expired", "cancelled"],
      default: "active",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
