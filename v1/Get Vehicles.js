/*
API:            Vehicles
Name:           Get Vehicles
HTTP Method:    GET
Relative path:  /vehicles
Description:    Returns data for selected vehicles.
*/

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Declare empty array for answer
    var answer = [];

    // Get values from the respective query parameters.
    var make = request.queryParams.make;
    var model = request.queryParams.model;
    var year = request.queryParams.year;
    var country = request.queryParams.country;
    var city = request.queryParams.city;

    // Generate 404 if no query parameters provided.
    if (!make && !model && !year && !country && !city) {
        response.setError(new sn_ws_err.NotFoundError('No query parameters defined.'));
        response.setStatus(404);
        return;
    }

    // Query the Vehicle table using these parameters.
    var vehicleTable = 'x_snc_veh_demo_vehicle';
    var vehicleGr = new GlideRecord(vehicleTable);
    if (make) { vehicleGr.addQuery('make', make); }
    if (model) { vehicleGr.addQuery('model', model); }
    if (year) { vehicleGr.addQuery('year', year); }
    if (country) { vehicleGr.addQuery('country', country); }
    if (city) { vehicleGr.addQuery('city', city); }
    vehicleGr.query();


    // Generate a 404 if no vehicles were found.
    if (!vehicleGr.hasNext()) {
        response.setError(new sn_ws_err.NotFoundError('No records found.'));
        response.setStatus(404);
        return;
    }

    // For the vehicles found, generate a JSON object and save the vehicle data in it.
    while (vehicleGr.next()) {

        var vehicleObj = {
            "make": vehicleGr.getValue('make'),
            "model": vehicleGr.getValue('model'),
            "vin": vehicleGr.getValue('vin'),
            "year": parseInt(vehicleGr.getValue('year'), 10),
            "country": vehicleGr.getValue('country'),
            "city": vehicleGr.getValue('city'),
            "start_date": vehicleGr.getValue('start_date'),
            "end_date": vehicleGr.getValue('end_date'),
        };
        answer.push(vehicleObj);
    }

    // Generate the response body.
    response.setBody(answer);

})(request, response);