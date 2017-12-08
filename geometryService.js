const env = require('dotenv');
env.config();
const KEY = 'AIzaSyDH47V1om25P0KbWWvDIl2TXMBqpUkA8iE'; // process.env.GOOGLE_API_KEY;
const turf = require('turf');
const { lineString } = require('@turf/helpers');
const pointToLineDistance = require('@turf/point-to-line-distance');
const booleanPointOnLine = require('@turf/boolean-point-on-line');
const booleanCrosses = require('@turf/boolean-crosses');
const googleMapsClient = require('@google/maps').createClient({ key: KEY });
const mapboxPolyline = require('@mapbox/polyline');

exports.getRouteFromLocations = (origin, destination) => {
    return new Promise((resolve, reject) => {
        googleMapsClient.directions({
            origin: [origin],
            destination: [destination]
        }, (err, response) => {
            !err ? resolve(response) : reject(err);
        });
    });
};

exports.isPointOnLine = (point, encodedPolyline) => {
    const polyline = mapboxPolyline.decode(encodedPolyline);
    return booleanPointOnLine(point, polyline);
};

exports.isPointCloseToLine = (point, polyline, threshhold) => {
    //const polyline = mapboxPolyline.decode(encodedPolyline);
    const distance = pointToLineDistance(point, polyline, { units: 'miles' });
    return distance <= threshhold;
};

exports.doLinesIntersect = (encodedLine1, encodedLine2) => {
    const line1 = mapboxPolyline.decode(encodedLine1);
    const line2 = mapboxPolyline.decode(encodedLine2);
    return booleanCrosses(line1, line2);
};

exports.test = () => {
    const encodedPolyline = "cstnEdbnpU@d@?@?@?@CJm@fCW`AMf@Od@Ut@cArCe@xAq@lB?@u@vBkD|Jq@nBc@rASh@e@vAYx@Wp@q@rB]bAm@`BUj@a@jAWp@w@hBOZS`@[p@INKROVOX]j@k@~@g@r@m@x@e@j@KLGDABC@C@SHiAhAA?EDw@x@[Zs@h@m@`@]T]RQFa@RSJQFMDiAXa@LWDg@FOB]Dy@Du@@u@As@EoBWy@Gu@Ek@?MAQ?_@@[BmAFy@Fa@@U@a@?W?a@Aa@Ca@C]Cm@KWCKCmASyC]}CU]Ak@Ae@?aEBoC@k@?}AFi@@uAJk@Di@Hm@Fm@JyAXi@LcBd@_A\\c@PsAh@UHeAh@_@L]Nc@Pc@Pe@R}@\\{An@WNUNo@f@MN[^QVGJAB[j@[z@A??BUp@CLAHCJAHCP?HCNAPARAb@Er@?HAF?DAJAJG^AJC^AFATE\\OnAU~BKhAEZC`@CNMrAKpA_@pESnCInAK|ACRATClAARCVEZK|AKzA?JInACd@?V?d@@^@^?NBb@Br@@T?X?T?V?RAPAZCTCVCZCLG\\IZI^GPCJUl@Wn@Q`@O\\MVc@t@yApCYh@[j@Yf@]n@mA|Bk@fAkAvBS`@o@jA]n@QZ]n@_@p@KNs@lAMRKP]h@w@pAk@v@[`@Y^_BtBST_@`@i@h@g@d@g@b@URUPUPo@h@gA|@gA|@k@d@eBvAEBi@b@i@b@UPWTe@`@YVSRQNY\\QTY^UZW^g@x@]h@GHq@dASXW`@[`@S\\e@p@aA|AiBpCeA`Ba@p@OXu@zAk@nAO\\Wr@Wp@c@rASr@K^_@tA[rAi@tB[nAiAnEw@~CQp@e@lBCDg@pBg@pB[nAg@pBa@tAq@vBi@|Ai@zAc@nAc@nAc@pAq@pBa@lAm@jBaA|Ca@pAABCHCJIViApDk@|A_A~Bg@lAc@fAi@bBm@nBa@|AYdAKb@Mj@Ml@i@nCe@jC]~Au@~Dq@rDS|@Y|ACHAJMn@I`@I`@If@YjBm@bE?@Kr@?Dc@`Dg@jDYpB[pBc@fDMjAShBO~AQtAKr@ObAWvAId@Ot@YvAUx@Wz@c@lAKZYp@k@pAYr@k@jAMZeAbCuAhD}@dC}@`Cm@dBQd@Up@wB~FSh@g@rAEHSb@_@x@?Ba@t@KRSb@Wd@CD]n@c@x@o@bAiAjB_@l@ILILABMTKPMPqBfDo@bAk@~@a@p@MPEDOVmAjB[b@g@l@g@n@i@f@k@j@k@d@e@^m@b@_@V_@VC@ABSPQHUL{Av@iExB_@RyAt@u@`@k@XUN[P]To@d@URc@`@g@h@WVe@l@QTOVMR_@l@q@lAAB[l@q@lA_AdB_@r@}@`Bc@v@_A|As@hAY`@g@n@c@h@QPEF_@`@_@^e@b@YTq@j@YPcAt@cAj@IFq@\\kB|@gKfFa@Pe@Re@Vs@\\s@b@[R_@X[Vg@f@[Zc@h@UXQRU\\g@~@i@dA]|@Y|@]tASbAMx@E`@E\\Ix@Cn@E~@?^Ah@AvAAv@?d@A|@Ar@C`@Ab@I~@ALCPE^G\\CTGZGZK^Kb@Oj@k@zAO^Yl@Wh@]l@u@vAu@vAOZ[h@]p@Uf@s@vAqDnHu@zAyBhEQXkA`Cg@|@Ud@]l@KN]j@Y\\iAvAKLQNCD]XMJg@`@[Re@Zu@`@q@XQJQFQF[JQDSFu@PaAT_@Js@Ne@LiDv@k@JkCl@sAXcAPk@JOBG@{@JgCf@q@Pe@Lq@RUFi@Rc@NSHYJ_@PYJUJo@ZeAj@_@TUN]Tq@b@}@n@e@^o@h@UTQNSPOPMLSPWXYZKLCDUVMRILQRoAzAs@~@]\\QXSVSVcAlAoA|AUXWZc@f@g@f@ONg@b@YTk@^_Al@eB`AWL[RYRWPQNQLa@\\ONQPi@h@iBjBEFMJWVMNo@n@uBvBo@p@";
    const x = this.isPointCloseToLine([34.02561, -118.206], encodedPolyline, 100);
    return x;
};