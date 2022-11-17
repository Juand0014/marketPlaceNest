export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

	if ( !file ) return callback(new Error('No file provided'), false);

	const fileExtention = file.mimetype.split('/')[1];
	const allowedFileExtention = ['jpeg', 'jpg', 'png', 'gif'];

	if( allowedFileExtention.includes(fileExtention) ){
		return callback(null, true);
	}

	callback(null, false);
}