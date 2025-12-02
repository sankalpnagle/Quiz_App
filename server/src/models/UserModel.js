// server/src/models/UserModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook WITHOUT `next`
userSchema.pre("save", function () {
  // if password unchanged, do nothing
  if (!this.isModified("password")) return;

  // bcryptjs sync version (no callbacks, no async, no next)
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

// ✅ Method to compare passwords
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
