import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

export const signup = async (req, res) => {
  try {
    // Take inputs from req.body
    // console.log('REQ.body: ', req.body);

    let { firstName, middleName, lastName, email, password, confirmPassword } =
      req.body;

    //2) Check if all required fields are filled or not?
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    // 3) Check if the user already exists with that email address
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }

    // 4) Hash the password(do using presave middleware in userModel)
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    // this will remove the password from the response as we dont want to show the password in the reponse enve if it is hashed
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
      message: 'Signup successful 😀',
    });
  } catch (error) {
    console.log('Error in signup controller: ', error);
    res.status(500).json({
      status: 'error',
      // message: 'Internal Server Error',
      message: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    //1)  Take the the credintials
    const { email, password } = req.body;

    // 2) Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    // --- We should not send this type of specific message ie. if the email is incorrect or password is incorrect ----
    // // 3) Check if user exists with that email or not and we need to select the pasword this time as we havent selected in the user schema(we need the password field to compare password)
    // const user = await User.findOne({ email }).select('password');
    // if (!user) {
    //   return res
    //     .status(401)
    //     .json({ status: 'fail', message: 'User not user not found' });
    // }

    // // Check for matchin password
    // const isPasswordValid = await user.verifyPassword(password, user.password);
    // if (!password) {
    //   return res.status(401).json({
    //     status: 'fail',
    //     message: 'Invalid Password',
    //   });
    // }

    // Right way of send the response
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.verifyPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credinitials',
      });
    }

    // console.log('user', user);
    // console.log(typeof process.env.ACCESS_TOKEN_EXPIRES_IN);
    //  If the password is valid we create token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        // expiresIn should be a number of seconds or string representing a timespan
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}`,
      }
    );

    // Do not send password in response
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
      },
      accessToken,
    });
  } catch (error) {
    console.log('Error in login controller: ', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
