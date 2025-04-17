import TravelStory from '../models/travelStoryModel.js';

// HANDLING FILE UPLOADS using `multer`

export const createTravelStory = async (req, res) => {
  try {
    const { title, storyContent, visitedLocations, isFavourite, visitedDate } =
      req.body;

    const author = req.user.id;

    // Check for cover image from req.body(passed from multer.js middleware)
    const coverImage = req.body.coverImage;
    console.log('In createTravelStory Controller coverImage: ', coverImage);
    if (!coverImage) {
      return res.status(400).json({
        status: 'fail',
        message:
          'No cover image uploaded. You need to upload cover image in order to continue',
      });
    }

    const images = req.body.images;
    console.log(images);

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
    const existingTravelStory = await TravelStory.findById({ _id: id });
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
    console.log('req.body', req.body);

    // update the story
    const updatedTravelStory = await TravelStory.findByIdAndUpdate(
      { _id: id },
      {
        title,
        storyContent,
        visitedLocations,
        isFavourite,
        author,
        coverImage,
        images,
        visitedDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log(updatedTravelStory);

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
