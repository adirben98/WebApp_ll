import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Document } from "mongoose";


const getUser=async (req: Request, res: Response) => {
  const username=req.params.name
  const user=await User.findOne({username:username})
  if(user){
    return res.status(200).send(user)
  }
  return res.status(404).send("User not found")

}
const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const imgUrl = req.body.image;
  if (email === undefined || password === undefined) {
    return res.status(400).send("Email and password are required");
  }
  try {
    // let user = await User.findOne({ email: email });
    // if (user) {
    //   return res.status(409).send("User already exists");
    // }
    // user=await User.findOne({username:username})
    // if (user) {
    //   return res.status(408).send("User already exists");
    // }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email: email,
      username: username,
      image: imgUrl,
      password: hashedPassword,
    });

    const tokens = await generateTokens(newUser);
    if (tokens == null) {
      return res.status(400).send("Error generating tokens");
    }
    return res.status(201).send({
      email: newUser.email,
      username: newUser.username,
      image: newUser.image,
      ...tokens,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
}
const isUsernameTaken=async(req: Request, res: Response)=>{
  const username = req.body.username;
  if (username === undefined) {
    return res.status(400).send("Username is required");
  }
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).send("Username already exists");
    } else {
      return res.status(200).send("Username is available");
    }}
    catch (err) {
      return res.status(400).send(err.message);

    }
}
const isEmailTaken = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (email === undefined) {
    return res.status(400).send("Email is required");
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send("Email already exists");
    } else {
      return res.status(200).send("Email is available");
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const generateTokens = async (
  user: Document<unknown, object, IUser> &
    IUser &
    Required<{
      _id: string;
    }>
): Promise<{ accessToken: string; refreshToken: string }> => {
  // generate token
  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.TOKEN_SECRET,
    {}
  );
  if (user.tokens == null) {
    user.tokens = [];
  }
  user.tokens.push(refreshToken);
  try {
    await user.save();
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    return null;
  }
};
const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === undefined || password === undefined) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(400).send("User doesnot exists");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const tokens = await generateTokens(user);
    if (tokens == null) {
      return res.status(400).send("Error generating tokens");
    }
    return res.status(200).send({
      email: user.email,
      username: user.username,
      image: user.image,
      ...tokens,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
const client = new OAuth2Client();

const googleLogin = async (req: Request, res: Response) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credentials,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({ email: email });
    if (user == null) {
      user = await User.create({
        email: email,
        username: payload.name,
        password: "google-login",
        image: payload.picture,
      });
    }
    const tokens = await generateTokens(user);
    res.status(200).send({
      email: user.email,
      username: user.username,
      image: user.image,
      ...tokens
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const refresh = async (req: Request, res: Response) => {
    const  refreshToken  = extractToken(req);
    if (refreshToken == null) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, data: jwt.JwtPayload) => {
        if (err) {
          return res.sendStatus(403);
        }
        const user = await User.findOne({ _id: data._id });
        if (user == null) {
          return res.sendStatus(403);
        }
        if (!user.tokens.includes(refreshToken)) { 
          user.tokens = [];
          await user.save();
          return res.sendStatus(403);
        }
        user.tokens = user.tokens.filter((token) => token !== refreshToken);
        const tokens = await generateTokens(user);
        
        if (tokens == null) {
          return res.status(400).send("Error generating tokens");
        }
        return res.status(200).send(tokens);
      }
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const extractToken = (req: Request): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err, data: jwt.JwtPayload) => {
        if (err) {
          return res.sendStatus(403);
        }
        const user = await User.findOne({ _id: data._id });
        if (user == null) {
          return res.sendStatus(403);
        }
        if (!user.tokens.includes(refreshToken)) {
          user.tokens = [];
          await user.save();
          return res.sendStatus(403);
        }
        user.tokens = user.tokens.filter((token) => token !== refreshToken);
        await user.save();
        return res.status(200).send();
      }
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
  res.send("logout");
};
const changePassword = async (req: Request, res: Response) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const username = req.body.username;

    const user = await User.findOne({ username: username });
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (user == null || !isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    const response = await User.findOneAndUpdate({ username: username }, user, {
      new: true,
    });
    return res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
const checkToken = async (req: Request, res: Response) => {
  const accessToken = extractToken(req); 
  try {
    jwt.verify(
      accessToken, 
      process.env.TOKEN_SECRET!,
      (err, data: jwt.JwtPayload) => { 
        if (err) {
          return res.sendStatus(403);
        } else {
           return res.sendStatus(200);
        }
      }
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
export type AuthRequest = Request & { user: { _id: string } };

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, data: jwt.JwtPayload) => {
    if (err) {
      return res.status(401).send(err.message);
    }
    const id = data._id;
    req.user = { _id: id };
    return next();
  });
   
  
};
const updateUserImg=async (req: AuthRequest, res: Response) =>{
  try{
    const imgUrl = req.body.imgUrl;
    const username = req.user._id;
    const user = await User.findOne({ _id: username });
    user.image = imgUrl;
    await user.save()
    return res.status(200).send(user)
  }
  catch(err){
    return res.status(400).send(err.message)
  }
}

export default {
  register,
  isEmailTaken,
  login,
  logout,
  authMiddleware,
  refresh,
  googleLogin,
  changePassword,
  checkToken,
  updateUserImg,
  isUsernameTaken,
  getUser
}
