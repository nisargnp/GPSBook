# GPSBook - The Online Address Book
**Keep track of favorite places online using just GPS coordinates. No need for addresses!**

## Developing the Website:

**S3**
* S3 will be used to store the website assets since S3 buckets are able to host static websites directly. S3 will also be used to store user images and image thumbnails.

**CloudFront**
* A CloudFront layer on top of S3 will allow the website to be cached across edge locations around the world, allowing for very fast access times.

**Route53**
* A Route53 domain will be registered for the website, allowing for convenient and memorable access to the website for any user.

## Developing the Backend:

**API Gateway**
* API Gateway will allow the client to communicate with the backend. It will support both the submission of a new place and the retrieval of all existing places. It will pass off requests to both DynamoDB and Lambda.

**DynamoDB**
* DynamoDB will be used to store place information such as name, description, location, and S3 image key/bucket.

**Lambda**
* Lambda will be used for two purposes.
  * A Lambda function will facilitate the submission of a new place. API Gateway will pass off the request to this Lambda function, which will send the name, description, and location to DynamoDB and will send the image to S3.
  * A Lambda function will convert the original images to thumbnails. This function will be triggered when an image is added to the S3 bucket (with the previous Lambda function), and will automatically retrieve that image, generate a thumbnail, and store the thumbnail in a new S3 bucket.

## Endpoints:

**/add-place - POST**
* Will allow for the submission of a new place. Submitted JSON needs to be in the following format:
	* name - String
	* description - String
	* latitude - String
	* longitude - String
	* image - base64 encoded String

**/places - GET**
* Will allow for the retrieval of all places stored in DynamoDB. Returned JSON will be in the following format:
	* guid - String
	* longitude - String
	* image-bucket - String
	* description - String
	* image-key - String
	* latitude - String
	* name - String

## Architecture diagram
<br>
<img src="https://github.com/nisargnp/GPSBook/blob/master/resources/architecture_diagram.png" hspace="20">
<br>

## Video Demo
<a target="_blank" href="https://youtu.be/MPv1wcXztvc">Link to video demo.</a>
[Testing](https://youtu.be/MPv1wcXztvc){:target="_blank"}
