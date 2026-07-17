console.log("AUTH CONTROLLER LOADED");

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const register = async (req, res) => {

  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("BODY:", req.body);


  try {

    const { username, password } = req.body || {};


    if (!username || !password) {

      return res.status(400).json(
        "Username and password required"
      );

    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    const user = new User({

      username,

      password: hashedPassword

    });


    await user.save();


    res.status(200).json({
  message: "REGISTER SUCCESS"
});


  } catch (error) {

    console.log(error);

    res.status(500).json(error.message);

  }

};





export const login = async (req, res) => {

  try {


    const { username, password } = req.body || {};


    const user = await User.findOne({
      username
    });


    if (!user) {

      return res.status(400).json(
        "User not found"
      );

    }


    const validPassword = await bcrypt.compare(
      password,
      user.password
    );


    if (!validPassword) {

      return res.status(400).json(
        "Wrong password"
      );

    }



    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET || "dev-secret"

    );


    res.json({
      token
    });


  } catch (error) {

    res.status(500).json(error.message);

  }

};