import TravelStory from '../models/travelStoryModel.js';

export const createTravelStory = async (req, res) => {
  try {
    const {
      title,
      story,
      visitedLocations,
      isFavourite,
      coverImage,
      visitedDate,
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (
      !title ||
      !story ||
      !visitedLocations ||
      !userId ||
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
      story,
      visitedLocations,
      isFavourite,
      userId,
      coverImage,
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
