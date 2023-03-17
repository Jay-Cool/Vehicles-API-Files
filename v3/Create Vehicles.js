/*
API:            Vehicles
Name:           Create Vehicles
HTTP Method:    POST
Relative path:  /vehicles
Description:    Create vehicle(s) from request body data.
*/

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Declare empty array for answer
    var answer = [];

    // Declare variables for the possible names in the request body.
    var make;
    var model;
    var vin;
    var year;
    var country;
    var city;

    // Get the request body, a JSON object.
    var requestBody = request.body;

    // Convert JSON object to a Javascript string using the RESTAPIRequestBody.datastring() method.
    var requestString = requestBody.dataString;

    // Convert Javascript string to an array.
    var result = JSON.parse(requestString);

    // For every vehicle in the array, create a record and push the sys_id and VIN of the record to an object.
    try {
        for (i in result.vehicles) {
            make = result.vehicles[i].make;
            model = result.vehicles[i].model;
            vin = result.vehicles[i].vin;
            year = result.vehicles[i].year;
            country = result.vehicles[i].country;
            city = result.vehicles[i].city;

            var vehicleTable = 'x_snc_veh_demo_vehicle';
            var vehicleGr = new GlideRecordSecure(vehicleTable);
            vehicleGr.initialize();
            vehicleGr.make = make;
            vehicleGr.model = model;
            vehicleGr.vin = vin;
            vehicleGr.year = year;
            vehicleGr.country = country;
            vehicleGr.city = city;
            vehicleGr.insert();

            var vehicleObj = {
                "vin": vehicleGr.vin,
                "sys_id": vehicleGr.sys_id
            };
            answer.push(vehicleObj);

        }
        response.setStatus(201);

    } catch (error) {
        var serviceError = new sn_ws_err.ServiceError();
        serviceError.setStatus(500);
        serviceError.setMessage('Service error');
        serviceError.setDetail('The server could not process the request.');
        response.setError(serviceError);
    }


    // Generate the response body. Contains all vehicle records created.
    response.setBody(answer);


})(request, response);