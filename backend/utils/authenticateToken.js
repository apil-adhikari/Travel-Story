import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

/** authenticateToken middleware: is to place the logged in user in req.user and is Middleware function to protect routes
 * STEPS:
 * 1) Getting the tokens and checking if its there (it it exists)
 * 2) Validate the token (#Very Important Step) where we verify the token
 * 3) Check if the user still exists
 * - Checks for later
 * 4) Check if the user changed the password after the token was issued
 */
export const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Get the token
    // const authHeader = req.headers['authorization'];
    // token = authHeader && authHeader.split(' ')[1];

    // From Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // console.log('TOKEN in Authorization Header: ', token);

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access',
      });
    }

    // Verify Token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: 'fail',
          message: 'Invalid token',
        });
      }
      if (decoded) {
        // console.log('DECODED: ', decoded);
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
          return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does not exist',
          });
        }
        // Send the current user in req.user
        req.user = currentUser;
        next();
      }
    });
  } catch (error) {
    console.log('Error in authtenticateToken() middleware: ', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
