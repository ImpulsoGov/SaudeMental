const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://saudemental.impulsogov.org',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
