import jwt from "jsonwebtoken";


const auth = (req, res, next) => {

  const token = req.header("x-token");


  if (!token) {

    return res.status(401).json("No Token");

  }


  try {

    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET || "dev-secret"

    );


    req.user = decoded;


    next();


  } catch (error) {

    res.status(400).json("Invalid Token");

  }

};

console.log("AUTH MIDDLEWARE LOADED");
export default auth;