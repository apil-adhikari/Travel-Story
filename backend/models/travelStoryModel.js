import mongoose, { Schema } from 'mongoose';

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
      trim: true,
      minLength: [
        10,
        'A travel story title must be more than or equal to 10 characters',
      ],
      maxLength: [
        '40',
        'A travel story must be less than or equal to 40 characters',
      ],
    },

    story: {
      type: String,
      required: [true, 'A travel must have some story'],
      trim: true,
      minLength: [
        5,
        'Story of your travel must be more than or equal to 5 characters',
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A story must be associated with certain user'],
    },

    coverImage: {
      type: String,
      required: [true, 'A travel story must have a coveer image'],
    },

    visitedDate: {
      type: Date,
      required: [
        true,
        'You must enter when you travelled to certain the place',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const TravelStory = mongoose.model('TravelStory', travelStorySchema);
export default TravelStory;
