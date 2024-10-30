const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    const cryptedPass = await bcrypt.hash(password, 10);

    const user = await User.create(
        {
            name,
            email,
            password: cryptedPass,
        },
        {
            returning: true,
        }
    );

    res.status(200).json(user);
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email },
    });

    const isValid = await bcrypt.compare(password, user?.password || "default");

    if (!user || !isValid) {
        return res.status(400).json({
            error: "Los datos son incorrectos",
        });
    }

    const token = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "30m",
        }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(200).json({ token });
};

const signOut = async (req, res) => {
    res.clearCookie("token");
    res.status(200).end();
};

module.exports = { signUp, signIn, signOut };
