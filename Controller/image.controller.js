const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const imageUpload = async (req, res) => {
    if (!req.files) {
        return;
    }
    // let file;
    // let name;

    if (req.files.singleImage) {
        file = req.files['singleImage'][0]
        const singleImageResponse = cloudinary.uploader.upload_stream({
            resource_type: 'auto'
        },
            (err, result) => {
                if (err) {
                    return res.send({ success: false, message: 'Error uploading single image' })
                }
                return res.send({ success: true, imageUrl: result.secure_url, name: 'singleImage' })
            })
        singleImageResponse.end(file.buffer)
    }
    else if (req.files.editedImage) {
        file = req.files['editedImage'][0]
        const editedImageResponse = cloudinary.uploader.upload_stream({
            resource_type: 'auto'
        },
            (err, result) => {
                if (err) {
                    return res.send({ success: false, message: 'Error uploading editedImage' })
                }

                file = req.files['editedImage'][0]
                file = req.files['editedImage'][0]
                return res.send({ success: true, imageUrl: result.secure_url, name: 'editedImage' })
            })
        editedImageResponse.end(file.buffer)
    }
    else if (req.files['galleryImage[]']) {
        const files = req.files['galleryImage[]'];
        const imagesUrl = [];

        // Create an array of Promises for each file upload
        const uploadPromises = files.map((imgData) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (err, result) => {
                        if (err) {
                            reject({ success: false, message: 'Error uploading galleryImage' });
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(imgData.buffer);  // Assuming you are using buffer data
            });
        });

        try {
            const imagesUrl = await Promise.all(uploadPromises);
            return res.send({ success: true, imageUrl: imagesUrl, name: 'galleryImage' });
        } catch (error) {
            return res.send(error);
        }
    }



}
module.exports = { imageUpload }