import { fileURLToPath } from 'url';
import fs from 'fs';
import TravelStory from '../models/travelStoryModel.js';
import path from 'path';

// HANDLING FILE UPLOADS using `multer`

export const createTravelStory = async (req, res) => {
  try {
    const { title, storyContent, visitedLocations, isFavourite, visitedDate } =
      req.body;

    const author = req.user.id;

    // Check for cover image from req.body(passed from multer.js middleware)
    const coverImage = req.body.coverImage;
    // console.log('In createTravelStory Controller coverImage: ', coverImage);
    if (!coverImage) {
      return res.status(400).json({
        status: 'fail',
        message:
          'No cover image uploaded. You need to upload cover image in order to continue',
      });
    }

    const images = req.body.images;
    // console.log(images);

    // console.log('REQ.BODY', req.body);

    // Validate required fields
    if (
      !title ||
      !storyContent ||
      !visitedLocations ||
      !author ||
      !coverImage ||
      !visitedDate
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    // No need to convert manually, mongoose can convert the date entered(valid date) in any type to valid mongoDB date
    // 1744606458974 =>2025-04-14T04:54:18.974Z and 2025-04-31 => 2025-05-01T00:00:00.000Z
    // Convert visitedDate from milliseconds to Date object format: "visitedDate": "2025-04-14T04:54:18.974Z"
    // const parsedVisitedDate = new Date(parseInt(visitedDate));

    const travelStory = await TravelStory.create({
      title,
      storyContent,
      visitedLocations,
      isFavourite,
      author,

      coverImage,
      images,
      // visitedDate: parsedVisitedDate,
      visitedDate,
    });

    res.status(201).json({
      status: 'success',
      message: 'Created successfully',
      data: {
        story: travelStory,
      },
    });
  } catch (error) {
    console.log('Error in createTravelStory() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

/** Gets all Travel Stories */
export const getAllTravelStory = async (req, res) => {
  try {
    const travelStories = await TravelStory.find().sort({
      isFavourite: -1,
    });

    return res.status(200).json({
      status: 'success',
      result: `${travelStories.length} story found`,
      data: {
        stories: travelStories,
      },
    });
  } catch (error) {
    console.log('Error in getAllTravelStory() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

/**Update the travel story
 * - get the specific travel story
 * - the user should be logged in and user who created the story can update it.
 */
export const updateTravelStory = async (req, res) => {
  try {
    // Get the travel story id we want to update from req.params
    const id = req.params.id;

    // Get the author of the story
    const author = req.user.id;

    // Get the data to be updated
    const { title, storyContent, visitedLocations, isFavourite, visitedDate } =
      req.body;

    // Find the travel story by ID that we want to update and ensure it belongs to the authenticated user
    const existingTravelStory = await TravelStory.findById({ _id: id, author });
    if (!existingTravelStory) {
      return res.status(400).json({
        status: 'fail',
        message: 'No story found with the provided ID',
      });
    }

    if (author != existingTravelStory.author) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not the owner of this post. ',
      });
    }

    const coverImage = req.body.coverImage;
    const images = req.body.images;
    // console.log(coverImage, images);
    // console.log('req.body', req.body);
    const slug = await TravelStory.updateSlug(title);

    // update the story
    const updatedTravelStory = await TravelStory.findByIdAndUpdate(
      { _id: id, author },
      {
        title,
        storyContent,
        visitedLocations,
        isFavourite,
        author,
        coverImage,
        images,
        visitedDate,
        slug,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Update successful',
      data: {
        story: updatedTravelStory,
      },
    });
  } catch (error) {
    console.log('Error in updateTravelStory() controller: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

/** Delete the travel story
 * - get the specify travel story id
 * - get the travel story to deltet
 * - the user should be logged in and he should be the owner
 */
export const deleteTravelStory = async (req, res) => {
  try {
    // Get the specific id of post
    const id = req.params.id;

    // Get the author
    const author = req.user.id;

    // Find the document with the given id
    const existingTravelStory = await TravelStory.findById({ _id: id, author });
    if (!existingTravelStory) {
      return res.status(400).json({
        status: 'fail',
        message: 'There is no such post related to the provided ID',
      });
    }

    // Check if the found document's author is same as the author comming from req.user.id
    if (author != existingTravelStory.author) {
      return res.status(401).json({
        status: 'fail',
        message:
          'You cannot delte this post because you are not the owner of this post',
      });
    }

    // Finally, delete the story
    await TravelStory.deleteOne({
      _id: id,
      author,
    });

    // Extract the filename from imageUrl
    // const coverImage = TravelStory.coverImage;
    // const images = TravelStory.images;

    const coverImage = existingTravelStory.coverImage;
    const images = existingTravelStory.images;
    const allImages = [coverImage, ...images];

    allImages.map((image) => {
      const __filename = image; //only for esmodule
      const __dirname = path.dirname(__filename); //only for esmodule

      const filePath = path.join(
        __dirname,
        'public/images/travelStoryImages/',
        __filename
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          return res.statuss(400).json({
            status: 'fail',
            message: 'Unable to deltet',
          });
        }
      });
      console.log(filePath);
    });

    res.status(204).json({
      status: 'success',
      message: 'Story deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteTravelStory: ', error);
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
