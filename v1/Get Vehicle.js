/*
API:            Vehicles
Name:           Get Vehicle
HTTP Method:    GET
Relative path:  /vehicle/{vin}
Description:    Returns data for selected vehicle.
*/

(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Declare empty array for answer
    var answer = [];

    // Get the VIN from the path parameter. Generate 404 if not provided.
    var vin = request.pathParams.vin;
    if (!vin) {
        response.setError(new sn_ws_err.NotFoundError('VIN not provided.'));
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

    // For the vehicle found, generate a JSON object and save the vehicle data in it.
    while (vehicleGr.next()) {

        var vehicleObj = {
            "make": vehicleGr.getValue('make'),
            "model": vehicleGr.getValue('model'),
            "year": vehicleGr.getValue('year'),
            // Or pass year as integer
            // "year": parseInt(vehicleGr.getValue('year'), 10),
            "city": vehicleGr.getValue('city'),
            "country": vehicleGr.getValue('country')
        };
        answer.push(vehicleObj);
    }

    // Generate the response body.
    response.setBody(answer);

})(request, response);