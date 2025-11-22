const userModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const foodPartnerModel = require('../models/foodpartner.model')

async function registerUser(req, res) {
    const { fullname, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })
    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        fullname,
        email,
        password: hashedPassword

    })

    const token = jwt.sign({
        id: user._id,

    }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered sucessfully",
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname
        }
    })
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        // Set cookie
        res.cookie("token", token);

        // Success response
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
            },
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User loggod out successfully"
    })
}


async function registerFoodPartner(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const { name, email, password, phone, address, contactName } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

    if (isAccountAlreadyExists) {
        return res.status(404).json({
            message: "Food partner User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token);

    return res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone

        }
    });
}


async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    });
}



function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}






module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}