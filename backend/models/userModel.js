import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const { Schema } = mongoose;

// create user schema

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A user must have a first name!'],
      trim: true,
      minLength: [3, 'First name must be more than or equal 3 character long!'],
      maxLength: [
        30,
        'First name must be less that or equal to 30 characters!',
      ],
    },
    middleName: {
      type: String,
      trim: true,
      minLength: [
        3,
        'Middle name must be more than or equal 3 character long!',
      ],
      maxLength: [
        30,
        'Middle name must be less that or equal to 30 characters!',
      ],
    },
    lastName: {
      type: String,
      required: [true, 'A user must have a last name!'],
      trim: true,
      minLength: [3, 'Last name must be more than or equal 3 character long!'],
      maxLength: [30, 'Last name must be less that or equal to 30 characters!'],
    },

    email: {
      type: String,
      required: [true, 'A user must have a email address!'],
      trim: true,
      unique: [true, 'Email address must be unique!'],
      lowercase: [true, 'Email must be lowercase!'],
      maxLength: [320, 'Email must be less than or equal to 320 characters!'],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address!',
      ],
    },

    password: {
      type: String,
      required: [true, 'A user must input a password!'],
      trim: true,
      minLength: [8, 'Password must be at least 8 characters!'],
      maxLength: [
        128,
        'Password must be less than or equal to 128 characters!',
      ],
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password!'],

      validate: {
        // This works on CREATE and SAVE
        validator: function (value) {
          return value === this.password;
        },
      },
    },
    active: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: { type: String, enum: ['admin', 'user'], default: 'user' },

    lastLoggedInAt: {
      type: Date,
      // default: Date.now(),
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving to the database using PreSave Hook
userSchema.pre('save', async function (next) {
  // Encrypt the password only if it is modified
  if (!this.isModified('password')) return next();

  // Else, encrypt(hash) the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Delete the confirmPassword field(it should not be stored in DB)
  this.confirmPassword = undefined;
  next();
});

// QUERY MIDDLEWARE to do certain things before doing query
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// VERIFY THE USER ENTERED PASSWORD AGAINST THE DATABASE (using Instances  methods)
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

// Check if the user has logged in again(if. if the issued at < lastLoggedInTime)
userSchema.methods.hasLoggedInAfter = function (tokenIssuedAtTimestamp) {
  if (this.lastLoggedInAt) {
    const lastLoggedInTimestamp = parseInt(
      this.lastLoggedInAt.getTime() / 1000,
      10
    );
    // console.log(
    //   'Token Issued Time Stamp: ',
    //   tokenIssuedAtTimestamp,
    //   'Last Logged In Time Stamp: ',
    //   lastLoggedInTimestamp
    // );
    // console.log(tokenIssuedAtTimestamp < lastLoggedInTimestamp);

    return tokenIssuedAtTimestamp < lastLoggedInTimestamp;
  }

  // False means used did not logged in again aftet the token was issued.
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
