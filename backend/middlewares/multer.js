import multer from 'multer';
import sharp from 'sharp';

// How to perform the action of saving images
// We should use multer for disk based file storage
// Additionally, we can use sharp to make the image of same dimension and also sightly reduce the image quality
// Uploaded image should be of image mime type

// HANDLE TRAVEL IMAGES: coverImage and images

// configure multer sotrage
const storage = multer.memoryStorage({
  // We can specify the destination and the filename here but we are using sharp to resize the images so we will do that while we resize the images
  // destination: function (req, file, cb) {
  //   cb(null, '/public/images/travelStoryImages/');
  // },
  // filename: function (req, file, cb) {
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //   cb(null, file.originalname + '-' + uniqueSuffix);
  // },
});

// Creating a file filter: accepting only image type files
const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Unknown file type! Please upload only images.'), false);
  }
};

// Creating multer instance with multer configuration
const upload = multer({
  storage: storage,
  fileFilter: multerFileFilter,
});

export const uploadTravelStoryImages = upload.fields([
  {
    name: 'coverImage',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 4,
  },
]);

export const resizeTravelStoryImages = async (req, res, next) => {
  // console.log('resize images: ', req.files);
  // console.log('req.body: ', req.body);
  // console.log('req.files.coverImage rezie images', req.files.coverImage);

  if (!req.files.coverImage) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please upload cover image',
    });
  }

  // console.log('NO Of cover images uploaded: ', req.files.coverImage.length());
  // 1) Handle cover image
  if (req.files.coverImage) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    req.body.coverImage = `cover-${uniqueSuffix}.jpeg`;
    // console.log(req.body.coverImage);

    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/travelStoryImages/${req.body.coverImage}`);
  }

  // 2) Handle other images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}-${i + 1}`;
        const filename = `${uniqueSuffix}.jpeg`;
        // console.log(req.body.images);
        // console.log(filename);
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/travelStoryImages/image-${filename}`);

        req.body.images.push(filename);
      })
    );
    // console.log(req.body.images);
  }

  next();
};
