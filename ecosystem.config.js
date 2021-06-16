module.exports = {
  apps: [
    {
      name: "sportyeah",
      script: "./build/sportyeah.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_test: {
        NODE_ENV: "test",
      },
    },
  ],
};
