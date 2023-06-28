module.exports = {
  port: 8080,
  files: [
    "./src/**/*.{html,htm,css,js}",
    "./node_modules/**/*.{html,htm,css,js}",
  ],
  server: { baseDir: "./src", routes: { "/vendor": "./node_modules" } },
};
