const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
      createProxyMiddleware('/api', {
        target: 'https://peaceful-shelf-28006.herokuapp.com/',
        changeOrigin: true
      }));
};