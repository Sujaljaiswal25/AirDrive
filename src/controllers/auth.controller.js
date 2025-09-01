const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

  const { name, email, password } = req.body;

  const isUserExist = await userModel.findOne({email})

  if(isUserExist){
    return res.status(400).json({message: "User already exists"})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword
  })

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

  res.cookie("token", token)

  return res.status(200).json({
    message: "User registered successfully",
    user
  })

};


const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        return res.status(400).json({message: "Invalid credentials"})
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        user:{
            name: user.name,
            email: user.email,
            _id: user._id
        }
    })

}


async function logout(req, res) {
    try {
        // Clear cookie (basic)
        res.clearCookie('token');
        // Also attempt with explicit options for cross-site deployments
        try {
            res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
        } catch {}
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error', err);
        return res.status(500).json({ message: 'Failed to logout' });
    }
}

module.exports = {
  register,
  login,
  logout
};
