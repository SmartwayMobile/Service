const openDataService = require('./openDataService');

openDataService.getCameras()
    .then(console.log);