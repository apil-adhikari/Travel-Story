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
  },
  {
    timestamps: {
      createdAt: {
        type: Date,
        default: Date.now,
        select: false,
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

export default User;
