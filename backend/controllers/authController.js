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
    const user = await User.findOne({ email }).select(
      '+password +lastLoggedInAt'
    );

    await User.findOneAndUpdate(
      { email },
      {
        lastLoggedInAt: Date.now(),
      }
    );
    // console.log(user);

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

//**RBAC: Role Base Access Control: using user roles and setting permission */
export const restrictRouteTo = (...roles) => {
  return (req, res, next) => {
    // Example: roles ['admin'] ✔️ has access but role ="user" ❌ doesnot have access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        mesasge: 'You do not have permission (role) to perform this action',
      });
    }
    next();
  };
};

/**UPDATE PASSWORD BY USER */
export const updatePassword = async (req, res) => {
  try {
    const id = req.user.id;

    const { password, confirmPassword } = req.body;

    const user = await User.findById(id).select('+password');

    // Check if there is POSTed password is correct
    if (!user || !(await user.verifyPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        mesasge: 'Your corrent password is wrong',
      });
    }

    // If there is user and the entered password is coreect
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save(); // User.findByIdAndUpdate will now work as intended here because presave hooks only run on .CREATE() or .SAVE()

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully 😀',
      data: {
        user,
      },
    });
  } catch (error) {
    console.log('Error in updateMyPassword() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

/**USER CREATION BY ADMIN */
export const createUser = async (req, res) => {
  try {
    // console.log(req.body);
    const {
      firstName,
      middleName,
      lastName,
      email,
      role,
      password,
      confirmPassword,
    } = req.body;

    if (!firstName || !middleName || !lastName || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
    });

    user.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
      message: 'Signup successful 😀',
    });
  } catch (error) {
    console.log('Error in createUser() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
