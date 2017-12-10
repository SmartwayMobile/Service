const openDataService = require('./openDataService');
const geometryService = require('./geometryService');
const firebaseService = require('./firebaseService');
const _ = require('lodash');

var msgArr = [];

// get users from firebase (optional: where currentTiem between route.startTime and route.endTime)
firebaseService.getIncidents().then(notifiedIncidents => {
  let incidentsToSave = [];
  incidentsToSave.push(...notifiedIncidents[0]);
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
                if (notifiedIncidents[0].indexOf(incident.id) > -1) return;
                incidentsToSave.push(incident.id);
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
                  if (geometryService.isPointCloseToLine([incidentLocation.lat, incidentLocation.lng], path, 1)) {
                    notifyUser(user, route.summary);
                  }
                });
                firebaseService.addIncidents(_.uniq(incidentsToSave));
              });

            }).catch(err => { console.log(err); process.exit(0); });
        });
      });
    }).catch(err => { console.log(err); process.exit(0); });

  }).catch(err => { console.log(err); process.exit(0); });
}).catch(err => { console.log(err); process.exit(0); });

function notifyUser(user, route) {
  var msg = `Incident reported on ${route}. Consider alternate route.`;
  console.log(msg);
  if (msgArr.indexOf(msg) > -1) return;
  firebaseService.sendMessage(msg);
  msgArr.push(msg);
}