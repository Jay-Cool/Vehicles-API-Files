/*
API:            Vehicles
Name:           Update Vehicle
HTTP Method:    PATCH
Relative path:  /vehicle/{vin}
Description:    Update vehicle with provided data.
*/

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Declare empty array for answer
    var answer = [];

    // Get the VIN from the path parameter.
    var vin = request.pathParams.vin.toString();

    // Declare variables for the possible names in the request body.
    var requestBody = request.body.data;
    var make = requestBody.make;
    var model = requestBody.model;
    var year = requestBody.year;
    var country = requestBody.country;
    var city = requestBody.city;

    //Generate 404 if VIN not provided.
    if (!vin) {
        response.setError(new sn_ws_err.NotFoundError('No VIN defined.'));
        response.setStatus(404);
        return;
    }

    // Generate 404 if request body contains no or invalid data.
    if (!make && !model && !year && !country && !city) {
        response.setError(new sn_ws_err.NotFoundError('Object contains no or invalid properties.'));
        response.setStatus(404);
        return;
    }

    // Query the Vehicle table for this VIN.
    var vehicleTable = 'x_snc_veh_demo_vehicle';
    var vehicleGr = new GlideRecord(vehicleTable);
    vehicleGr.addQuery('vin', vin);
    vehicleGr.query();

    // Generate a 404 if no vehicle was found.
    if (!vehicleGr.hasNext()) {
        response.setError(new sn_ws_err.NotFoundError('No vehicle found.'));
        response.setStatus(404);
        return;
    }

    // For the vehicle found, update the record with the details in the request body.
    if (vehicleGr.next()) {
		if (make) {vehicleGr.make = make;}
		if (model) {vehicleGr.model = model;}
		if (year) {vehicleGr.year = year;}
		if (country) {vehicleGr.country = country;}
		if (city) {vehicleGr.city = city;}
        vehicleGr.update();
    }

    // Set a 200 status for success.
    response.setStatus(200);

    // Create a JSON object with details of the updated record.
    var vehicleObj = {
        "make": vehicleGr.make,
        "model": vehicleGr.model,
        "vin": vehicleGr.vin,
        "year": vehicleGr.year,
        "country": vehicleGr.country,
        "city": vehicleGr.city,
        "sys_id": vehicleGr.sys_id
    };
    answer.push(vehicleObj);

    // Generate the response body.
    response.setBody(answer);


})(request, response);