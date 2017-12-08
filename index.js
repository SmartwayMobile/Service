const openDataService = require('./openDataService');
const geometryService = require('./geometryService');
const firebaseService = require('./firebaseService');

// get users from firebase (optional: where currentTiem between route.startTime and route.endTime)
openDataService.getIncidents().then(res => {
  const incidents = res.data;
  firebaseService.getUsers().then((users) => {
    users.forEach(user => {
      const routeKeys = Object.keys(user.routes);
      routeKeys.forEach(routeKey => {
        const userRoute = user.routes[routeKey];
        const routeName = userRoute.name;
        geometryService.getRouteFromLocations(`${userRoute.startCoords.lat},${userRoute.startCoords.lng}`,
          `${userRoute.endCoords.lat},${userRoute.endCoords.lng}`).then((obj) => {
            incidents.forEach(incident => {
              const incidentLocation = incident.locations[0].coordinates[0];
              if (!incidentLocation) return;
              obj.json.routes.forEach(route => {
                let path = [];
                route.legs.forEach(leg => {
                  leg.steps.forEach(step => {
                    let start = step.start_location;
                    let end = step.end_location;
                    path.push([start.lat, start.lng], [end.lat, end.lng]);
                  });
                });
                incident = [36.1728045, -86.7652469];
                if (geometryService.isPointCloseToLine([incidentLocation.lat, incidentLocation.lng], path, 0.05)) {
                  //notifyUser(user, incident);
                  console.log(`Incident along your route ${routeName} at ${route.summary}. Consider alternate route.`);
                }
              });
            });
          }).catch(err => console.log(err));
      });
    });
  }).catch(err => console.log(err));
}).catch(err => console.log(err));
// get incidents from opendata
// incidents = openDataService.getIncidents();

// loop through each user
// users.forEach((user) => {
//   // loop through each route
//   user.routes.forEach((route) => {
//     geometryService.getRouteFromLocations(route.startAddress, route.endAddress).then((polyline) => {
//       incidents.forEach((incident) => {
//         if (geometryService.isPointCloseToLine(incident, polyline)) {
//           notifyUser(user, incident);
//         }
//       });
//     });
//   });
// });

function notifyUser(user, incident) {
  var msg = `Incident reported on ${incident.route}. Consider alternate route.`;
  // push msg to user
}