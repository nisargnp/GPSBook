
$(document).ready(function() {

    // constant URLs
    const URL_API_GPSBOOK = "https://avg23q1wgk.execute-api.us-east-1.amazonaws.com/prod/";
    const URL_ADD_PLACE = URL_API_GPSBOOK + "add-place";
    const URL_GET_PLACES = URL_API_GPSBOOK + "places";
    const URL_GET_S3_RESOURCE = "https://s3.amazonaws.com/"; // + bucket + "/" + key
    const URL_GOOGLE_MAPS = "https://www.google.com/maps/search/?api=1&query="; // + lat + "," + long

    $.get(URL_GET_PLACES, function(data, status) {

        $("#results").html("");

        console.log(status);
        console.log(data);

        let results = [];

        for (let i = 0; i < data.Items.length; i++) {
            let info = data.Items[i];
            let resultRow = createResultRow(info);
            results.push(resultRow);
        }

        let resultsStr = results.join("");
        console.log(resultsStr);

        $("#results").append(results.join(""));

    });

    // function createResultDiv(info) {

    //     console.log(info);

    //     let guid = info.guid.S;
    //     let name = info.name.S;
    //     let desc = info.description.S;
    //     let imageBucket = info['image-bucket'].S;
    //     let imageKey = info['image-key'].S;
    //     let lat = info.latitude.S;
    //     let long = info.longitude.S;

    //     let imageURL = URL_GET_S3_RESOURCE + imageBucket + "/" + imageKey;
    //     let imageThumbnailURL = URL_GET_S3_RESOURCE + imageBucket + "-thumbnails" + "/" + imageKey;
    //     let locationURL = URL_GOOGLE_MAPS + lat + "," + long;

    //     let resultName = "<h3>" + name + "</h3>";
    //     let resultDesc = "<p>" + desc + "</p>";
    //     let resultImageThumbnail = "<img align='right' style=\"{max-width:100%;max-height:100%}\" src='" + imageThumbnailURL + "'>";
    //     let resultImage = "<a target='_blank' href='" + imageURL + "'>" + resultImageThumbnail + "</a>";
    //     let resultLocation = "<a target='_blank' href='" + locationURL + "'>Location</a>";

    //     let resultDiv = "<div class='result'>" + resultName + resultImage + resultDesc  + resultLocation + "</div>";

    //     let lineBreak = "<br>";
        
    //     console.log(resultDiv + lineBreak);

    //     return resultDiv + lineBreak;
    // }

    function createResultRow(info) {

        console.log(info);

        let guid = info.guid.S;
        let name = info.name.S;
        let desc = info.description.S;
        let imageBucket = info['image-bucket'].S;
        let imageKey = info['image-key'].S;
        let lat = info.latitude.S;
        let long = info.longitude.S;

        let imageURL = URL_GET_S3_RESOURCE + imageBucket + "/" + imageKey;
        let imageThumbnailURL = URL_GET_S3_RESOURCE + imageBucket + "-thumbnails" + "/" + imageKey;
        let locationURL = URL_GOOGLE_MAPS + lat + "," + long;

        let resultName = "<h3>" + name + "</h3>";
        let resultDesc = "<p>" + desc + "</p>";
        let resultLocation = "<a target='_blank' href='" + locationURL + "'>Location</a>";

        let resultImage = "<img class='resultImage' src='" + imageThumbnailURL + "'>";
        let resultImageLink = "<a target='_blank' href='" + imageURL + "'>" + resultImage + "</a>";

        let colInfo = "<td class='colInfo'>" + resultName + resultDesc + resultLocation + "</td>";
        let colImage = "<td class='colImage'>" + resultImageLink + "</td>";
        

        let resultRow = "<tr>" + colInfo + colImage + "</tr>";

        console.log(resultRow);

        return resultRow;
    }

      // contact form animations
    $('#contactButton').click(function() {
        $('#contactForm').fadeToggle();
    });

    $("#formClose").click(function() {
        $('#contactForm').fadeToggle();
    });

    // html 5 get location
    function getLocation(success, error) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Location tracking not supported on device.");
        }
    }

    $("#formSubmit").click(function(event) {

        event.preventDefault();
        document.getElementById("submitSpinner").style.display = "block";

        getLocation(function(position) {

            console.log(position);

            // get data
            let lat = position.coords.latitude + "";
            let long = position.coords.longitude + "";
            let name = $("#submitName").val();
            let desc = $("#submitDesc").val();

            let file = document.getElementById('submitFile').files[0];
            let reader = new FileReader();
            reader.onload = function() {

                let result = reader.result;

                const body = {
                    'name': name,
                    'description': desc,
                    'latitude': lat,
                    'longitude': long,
                    'image': result
                }

                $.ajax({
                    type: 'POST',
                    url: URL_ADD_PLACE,
                    data: JSON.stringify(body),
                    dataType: "json",
                    success: function(data) {
                        console.log(data);
                        $('#contactForm').fadeToggle();
                        document.getElementById("submitSpinner").style.display = "none";
                    },
                    error: function(error) {
                        console.log("ERROR AJAX:");
                        console.log(error);
                        $('#contactForm').fadeToggle();
                        document.getElementById("submitSpinner").style.display = "none";
                    }
                });

            }

            reader.onerror = function(error) {
                alert("ERROR LOADING IMAGE:");
                alert(error);
                $('#contactForm').fadeToggle();
                document.getElementById("submitSpinner").style.display = "none";
            }

            reader.readAsDataURL(file);

        }, 
        function logError(error) {
            console.log("ERROR GEOLOCATION:");
            console.log(error);
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
            $('#contactForm').fadeToggle();
            document.getElementById("submitSpinner").style.display = "none";
        });

    });

});