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
