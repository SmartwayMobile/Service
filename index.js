const openDataService = require('./openDataService');
const geometryService = require('./geometryService');

console.log(geometryService.test());

// get users from firebase (optional: where currentTiem between route.startTime and route.endTime)
var users = [];
// get incidents from opendata
var incidents = [];
incidents = openDataService.getIncidents();

// loop through each user
users.forEach((user) => {
  // loop through each route
  user.routes.forEach((route) => {
    geometryService.getRouteFromLocations(route.startAddress, route.endAddress).then((polyline) => {
      incidents.forEach((incident) => {
        if (geometryService.isPointCloseToLine(incident, polyline)) {
          notifyUser(user, incident);
        }
      });
    });
  });
});

function notifyUser(user, incident) {
  var msg = `Incident reported on ${incident.route}. Consider alternate route.`;
  // push msg to user
}