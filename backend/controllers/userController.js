import User from '../models/userModel.js';

// --- CRUD Operations---

export const getUser = async (req, res) => {
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
// --- End of CRUD Operations ---
