const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://geneonline.cloud.looker.com',
      changeOrigin: true,
    })
  );
};