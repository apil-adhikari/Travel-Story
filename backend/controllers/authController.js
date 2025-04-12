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

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
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
