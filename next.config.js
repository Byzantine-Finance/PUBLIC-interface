module.exports = {

  webpack(config) {

    config.resolve.fallback = {
      ...config.resolve.fallback,
      dgram: false
    };
    
    return config;
    
  },

  reactStrictMode: true,

}