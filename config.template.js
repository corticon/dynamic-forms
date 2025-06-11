/**
 * Application Configuration
 *
 * Copy this file to 'config.js' and fill in your specific backend URL.
 * 'config.js' is gitignored by default to keep your endpoint private.
 */
const AppConfig = {
    // The full URL to your backend endpoint (e.g., a Google Cloud Function)
    // that will process the form submission data, including files.
    submissionUrl: 'PASTE_YOUR_BACKEND_ENDPOINT_URL_HERE'
};

// Make it available globally
window.AppConfig = AppConfig;