"use strict";

// get dependencies
const AWS = require("aws-sdk");
const sha256 = require("sha256");
const atob = require("atob");

// get env
const bucket = process.env.BUCKET;
// const config = new AWS.Config({
// 	accessKeyId: process.env.ACCESS_KEY_ID,
// 	secretAccessKey: process.env.SECRET_ACCESS_KEY,
// 	region: process.env.REGION
// });

// set config
//AWS.config.update(config);

const s3 = new AWS.S3()

const imageTypes = [
	'image/jpg',
	'image/png',
	'image/jpeg'
];

exports.handler = (event, context, callback) => {
	
	console.log("PRINTING EVENT:");
	console.log(event);
	
	console.log("PRINTING REQUEST BODY:");
	let respBody = event.body;
	console.log(typeof respBody);
	console.log()
	console.log(respBody);

	console.log("PRINGING JSON BODY:");
	let body = JSON.parse(event.body);
	console.log(body);
	
	console.log("Image:");
	let base64Image = body['image'];
	console.log(typeof base64Image);
	console.log(base64Image);

	//let fileBuffer = new Buffer(base64Image, 'base64');
	//console.log("File Buffer:");
	//console.log(fileBuffer);
	
	let fileBuffer = atob(base64Image);

	let mime = base64Image.split(";")[0].split(":")[1];
	let ext = mime.split("/")[1];
	
	if (imageTypes.includes(mime)) {

		let hash = sha256((new Date()).toString());
		let fileName = hash + "." + ext;

		let params = {
			Body: fileBuffer,
			Key: fileName,
			Bucket: bucket,
			ACL: 'public-read',
			ContentEncoding: 'base64',
			ContentType: mime
		};

		s3.putObject(params, (err, data) => {
			if (err) return callback(new Error([err.statusCode], [err.message]));
			let resp = {
				"isBase64Encoded": false,
				"statusCode": 200,
				"headers": {"Access-Control-Allow-Origin:": "*"},
				"body": JSON.stringify({'data': data})
			};
			callback(null, resp);
		});


	} else {
		let resp = {
			"isBase64Encoded": false,
			"statusCode": 400,
			"headers": {"Access-Control-Allow-Origin:": "*"},
			"body": JSON.stringify({'message': "File type is not valid."})
		};
		callback(null, resp);
	}

}