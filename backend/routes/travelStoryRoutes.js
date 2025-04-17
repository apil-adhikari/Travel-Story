import express from 'express';
import {
  createTravelStory,
  getAllTravelStory,
  updateTravelStory,
  deleteTravelStory,
  updateIsFavourite,
  searchStoreis,
} from '../controllers/travelStoryController.js';
import { authenticateToken } from '../utils/authenticateToken.js';
import {
  resizeTravelStoryImages,
  uploadTravelStoryImages,
} from '../middlewares/multer.js';

const router = express.Router();

/**
 * To access these routes(apis) there are certain conditions or protections that we need to follow:
 * 1) User who is not logged in can read(view) the uploaded travel story.
 * 2) User must be logged in to add,update or delte the travel story.
 * 3) User must be logged in to add the story in their favourite.
 * 4) Story can be updated or deleted by the user who is the owner of the story(the user who created the story).
 */

// INITLALLY, FOCUS ON CRUD OPERATIONS (base url: /api/v1/travelstory)

// The user should be logged in to do access the following routes
router.use(authenticateToken);

router.post(
  '/',
  uploadTravelStoryImages,
  resizeTravelStoryImages,
  createTravelStory
);
router.get('/', getAllTravelStory);
// router.get('/:id', getTravelStory);
router.patch(
  '/:id',
  authenticateToken,
  uploadTravelStoryImages,
  resizeTravelStoryImages,
  updateTravelStory
);
router.delete('/:id', authenticateToken, deleteTravelStory);

// ROUTE FOR SEARCH TRAVEL STORY
router.patch('/update-is-favourite/:id', authenticateToken, updateIsFavourite);

// SEARCH (public route)
router.get('/search', authenticateToken, searchStoreis);

export default router;
