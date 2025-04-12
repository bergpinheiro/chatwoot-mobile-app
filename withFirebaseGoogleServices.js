// withFirebaseGoogleServices.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (config.android?.googleServicesFile) {
        const googleServicesJson = config.android.googleServicesFile;
        // Check if it's an object, meaning it's likely the EAS secret
        if (typeof googleServicesJson === 'object' && googleServicesJson !== null) {
          const googleServicesJsonContent = googleServicesJson['']; // Access the content
          if (googleServicesJsonContent) {
            const googleServicesFilePath = path.join(
              config.modRequest.platformProjectRoot,
              'app',
              'google-services.json'
            );
            // Ensure the directory exists
            fs.mkdirSync(path.dirname(googleServicesFilePath), { recursive: true });
            fs.writeFileSync(googleServicesFilePath, googleServicesJsonContent, 'utf8');
            // Update the config to point to the generated file
            config.android.googleServicesFile = 'app/google-services.json';
          } else {
            console.warn(
              'No content found in googleServicesFile. Ensure your EAS secret is correctly set.'
            );
          }
        }
      }
      return config;
    },
  ]);
};
