import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

/** travel Story Schema Structure:
 * - Story Title: String, required
 * - Story: String, required
 * - visitedLocations: [String], required
 * - isFavourite: Boolean, default: flase
 * - userId: Foreign key(type of Schema.Types.ObjectId and ref to "User" model), required
 * - coverImage: String, required
 * - visitedDate: Date, required
 * OPTIONAL DATA THAT I CAN ADD LATER: slugs, geoJSON data for locations
 */
const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A travel story must have a title'],
      unique: true,
      index: true,
      trim: true,
      minLength: [
        10,
        'A travel story title must be more than or equal to 10 characters',
      ],
      maxLength: [
        40,
        'A travel story must be less than or equal to 40 characters',
      ],
      validate: {
        validator: function (value) {
          // return /^[a-zA-Z ]+$/.test(value.trim()) && value.trim().length > 0; // not allowing numbers it title
          return (
            /^[a-zA-Z0-9 ]+$/.test(value.trim()) && value.trim().length > 0
          ); // Allow numbers too
        },
        message: 'Title must contain only letters and spaces.',
      },
    },

    storyContent: {
      type: String,
      required: [true, 'A travel must have some story content'],
      trim: true,
      minLength: [
        5,
        'Story content of your travel must be more than or equal to 5 characters',
      ],
    },

    visitedLocations: {
      type: [String], // Array of string
      default: [],
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    // REFERENCE TO USER: A story must belong to certain user
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A story must be associated with certain user'],
    },

    coverImage: {
      type: String,
      required: [true, 'A travel story must have a coveer image'],
    },

    images: {
      type: [String],
      default: [],
    },

    visitedDate: {
      type: Date,
      required: [
        true,
        'You must enter when you travelled to certain the place',
      ],
    },

    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

// DOCUMENT MIDDLEWARES
travelStorySchema.pre('save', function (next) {
  // Replace all non-letter and non-space characters with a space
  this.title = this.title
    // .replace(/[^a-zA-Z ]/g, ' ') // not allowing numbers in title
    .replace(/[^a-zA-Z0-9 ]/g, ' ') // Replace special characters with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .trim(); // Trim leading/trailing spaces

  next();
});

travelStorySchema.pre('save', function (next) {
  console.log('IN PRE SAVE HOOK:::');
  this.slug = slugify(this.title, {
    trim: true,
    lower: true,
    strict: true,
  });
  next();
});

travelStorySchema.statics.updateSlug = async function (title) {
  // console.log('IN STATIC FUNCTION:::');
  const slug = slugify(title, {
    trim: true,
    lower: true,
    strict: true,
  });
  return slug;
};

const TravelStory = mongoose.model('TravelStory', travelStorySchema);
export default TravelStory;
