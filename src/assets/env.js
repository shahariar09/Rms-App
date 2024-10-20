//development  localhost
(function (window) {
  window.__env = window.__env || {};
  // window.__env.apiUrl = `https://${window.location.hostname}:7218/api/`;
  window.__env.apiUrl = `http://localhost:5287/api/`;
  window.__env.imgUrl = `http://localhost:5144/`;


  window.__env.enableDebug = true;
  window.__env.uiVersion = "0.0.1.7";
})(this);
// (function (window) {
//   window.__env = window.__env || {};
//   window.__env.apiUrl = `http://192.168.0.183:8086/api/`; // `https://${window.location.hostname}:7218/api/` `http://192.168.0.152:8086/api/`;
//   window.__env.enableDebug = true;
//   window.__env.uiVersion = `0.0.0.1`;
// })(this);

////local iis

// (function (window) {
//   window.__env = window.__env || {};
//   window.__env.apiUrl = 'http://192.168.1.172:70/';
//   window.__env.reportUrl = 'http://192.168.1.172:72/';
//   window.__env.secrectKey = '1';
//   window.__env.enableDebug = true;
//  })(this);

// live customer
// (function (window) {
//   window.__env = window.__env || {};
//   window.__env.apiUrl = 'http://172.16.2.33:8082/';
//   window.__env.reportUrl = 'http://172.16.2.33:8081/';
//   window.__env.secrectKey = '1';
//   window.__env.enableDebug = true;
// })(this);
