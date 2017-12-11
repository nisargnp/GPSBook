
// dependencies
const async = require('async');
const gm = require('gm').subClass({imageMagick: true}); // Enable ImageMagick integration.
const util = require('util');
const AWS = require('aws-sdk');

// constants
const MAX_WIDTH = 100;
const MAX_HEIGHT = 100;

// s3 client
const s3 = new AWS.S3();

// possible image types
const imageTypes = [
	"png",
	"jpg",
	"jpeg"
];

exports.handler = function(event, context, callback) {

	console.log("Event:\n", util.inspect(event, {depect: 5}));

	console.log(event.Records[0].s3);

	let srcBucket = event.Records[0].s3.bucket.name;
	let srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ""));

	console.log(srcBucket);
	console.log(srcKey);

	let dstBucket = srcBucket + "-thumbnails";
	let dstKey = srcKey;

	if (srcBucket == dstBucket) {
		callback("Source and dest are the same.");
		return;
	}

	let typeMatch = srcKey.match(/\.([^.]*)$/);
	if (!typeMatch) {
		callback("No file extension provided on key.");
		return;
	}

	let imageType = typeMatch[1];
	if (!imageTypes.includes(imageType)) {
		callback("Image type not supported: " + imageType);
		return;
	}

	async.waterfall([
		function download(next) {
			s3.getObject({
				"Bucket": srcBucket,
				"Key": srcKey
			}, next);
		},
		function transform(resp, next) {
			gm(resp.Body).size(function(err, size) {
				
				if (err) {
					console.log ("Error: " + err);
					return;
				}
				
				// calculate new height and width
				let scalingFactor = Math.min(MAX_HEIGHT / size.height, MAX_WIDTH / size.width);
				var height = scalingFactor * size.height;
				var width = scalingFactor * size.width;

				// scale the image
				this.resize(width, height)
					.toBuffer(imageType, function(err, buffer) {
						if (err) {
							next(err);
						} else {
							next(null, resp.ContentType, buffer);
						}
					});

			});
		},
		function upload(contentType, data, next) {
			s3.putObject({
				"Bucket": dstBucket,
				"Key": dstKey,
				"Body": data,
				"ContentType": contentType,
				"ACL": "public-read"
			}, next);
		}
	], function(error) {
		if (error) {
			console.log("Error: " + error);
		} else {
			console.log("Successful conversion.");
		}
	});

}
