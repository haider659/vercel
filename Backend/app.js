import express from "express";
import mongoose from "mongoose";
import postModel from "./model/postSchema.js";
import bcrypt from "bcryptjs";
import userModel from "./model/userSchema.js";
import cors from "cors";

const app = express();
const PORT = 5176;
const DBURI = "mongodb+srv://admin:admin@cluster0.ahhgl.mongodb.net/";

app.use(cors()); // Enable CORS for handling cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Connect to MongoDB
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Basic route
app.get("/", (req, res) => { 
    res.json({
        message: "Server up...",
        status: true,
    });
});

// Signup API
app.post("/signupapi", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if required fields are missing
    if (!firstName || !lastName || !email || !password) {
        res.json({
            message: "Required fields are missing",
            status: false,
        });
        return;
    }

    try {
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Create user object
        const userObj = {
            firstName,
            lastName,
            email,
            password: hashPassword,
        };
        
        // Save user in DB
        await userModel.create(userObj);

        res.json({
            message: "User created successfully",
            status: true,
        });
    } catch (error) {
        res.json({
            message: "Error creating user",
            status: false,
            error: error.message,
        });
    }
});

// Login API
app.post("/loginapi", async (req, res) => {
    const { email, password } = req.body;

    // Check if required fields are missing
    if (!email || !password) {
        res.json({
            message: "Required fields are missing",
            status: false,
        });
        return;
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        // If user not found
        if (!user) {
            res.json({
                message: "Invalid email or password",
                status: false,
            });
            return;
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.json({
                message: "Invalid email or password",
                status: false,
            });
            return;
        }

        // Login successful
        res.json({
            message: "Login successful",
            status: true,
        });
    } catch (error) {
        res.json({
            message: "Error logging in",
            status: false,
            error: error.message,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
