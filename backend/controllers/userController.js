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

// --- End of CRUD Operations ---
