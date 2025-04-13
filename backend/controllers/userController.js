import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

/**filterObject : function to filter req.body data to include only certain fields
 * -Fields allowed to update: firstName, middleName, lastName, email
 */

const filterObject = (obj, ...fieldsAllowedToUpdate) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (fieldsAllowedToUpdate.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};

// --- CRUD Operations---

export const getMe = async (req, res) => {
  try {
    // Take id from the req.user (ie. currently logged in user)
    const id = req.user.id;

    const isUser = await User.findOne({ _id: id });

    if (!isUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        isUser,
      },
    });
  } catch (error) {
    console.log('Error in getUser() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

/**
 * Update User
 * - Only used to update the user data (create error if user POSTs password data)
 * - Can' update password from this endpoint
 */
export const updateMe = async (req, res) => {
  try {
    // 1) Create error if the user posts password data
    if (req.body.password || req.body.confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message:
          'This route is not for password change. Please use /update-my-password route insted',
      });
    }

    // ACTAULL UPDATE USER DATA by a logged in user
    // Filter out unwanted fields that are not allowd to be updated.
    const filteredBody = filterObject(
      req.body,
      'firstName',
      'middleName',
      'lastName',
      'email'
    );

    // Also allow to change the avatar
    if (req.file) filteredBody.avatar = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true, //  returns the modified document rather than the original
        runValidators: true, // Update validators validate the update operation against the model's schema
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
      message: 'Update successful 😀',
    });
  } catch (error) {
    console.log('Error in updatePassword() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

/**  Delete account by user(by logged in user)
 * - We do not actually delete the account, but we deactivate the account by setting the active flag to false and return the null data.
 *  */

export const deleteMe = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);

    console.log('REQ.USER.id', req.user.id);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { active: false },
      { new: true, runValidators: true }
    );
    console.log(user);

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'User deleted successfully 😀',
    });
  } catch (error) {
    console.log('Error in deleteMe() controller: ', error);
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

// --- End of CRUD Operations ---

// --- Admin Accessed Routes ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: `${users.length} documents found`,
      data: {
        users,
      },
    });
  } catch (error) {
    console.log('Error in getAllUsers() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
  } catch (error) {
    console.log('Error in getUser() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, middleName, lastName, email, password, role, active } =
      req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
        role,
        active,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully 😀',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.log('Error in updateUser() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    console.log('Error in deleteUser() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
// --- End of Admin Accessed Routes ---
