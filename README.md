# GPSBook - The Online Address Book
**Keep track of favorite places online using just GPS coordinates. No need for addresses!**

## Developing the Website:

**S3**
* S3 will be used to store the website assets since S3 buckets are able to host static websites directly from the buckets. S3 will also be used to store images and image thumbnails.

**CloudFront**
* A CloudFront layer on top of S3 will allow the website to be cached across edge locations around the world, allowing for very fast access times.

**Route53**
* A Route53 domain will be registered for the website, allowing for convenient access to the website for any user.

## Developing the Backend:

**API Gateway**
* API Gateway will allow the client to communicate with the backend. It will support both the submission of a new place, or the retrieval of existing places.

**DynamoDB**
* DynamoDB will be used to store place information, including name, description, location, and image location in S3.

**Lambda**
* Lambda will be used for two purposes.
  * The first is to allow submission of a new place. API Gateway will pass off the submission to a Lambda function, which will send the name, desc, and location to DynamoDB and send the image to S3.
  * Lambda will also be used to generate thumbnails for the raw images added to the S3 bucket.