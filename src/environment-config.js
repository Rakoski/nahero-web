(function (window) {
  window.env = window.env || {};

  window.env.apiUrl = process.env.API_URL || 'http://localhost:8080/api/v1/';
})(this);
