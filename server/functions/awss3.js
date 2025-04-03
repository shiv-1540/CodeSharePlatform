const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// const uploadCodeFileToS3 = async (buffer, fileName) => {
//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: fileName,
//     Body: buffer,
//     ContentType: 'text/plain', // keep this generic for code files
//   };

//   const upload = new Upload({ client: s3Client, params: uploadParams });
//   const result = await upload.done();
//   return result.Location; // public URL
// };

// module.exports = { uploadCodeFileToS3 };

const uploadFileToS3 = async (fileBuffer, fileName, fileType) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,

  };

  try {
    const upload = new Upload({ client: s3Client, params: uploadParams });
    const result = await upload.done();
    return result.Location;  // URL of the uploaded file
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw err;
  }
};

module.exports = { uploadFileToS3 };
