// Auto-Detecting Environment Configuration for Lumi
// Automatically loads the correct configuration based on hostname
// No script execution needed - just open index.html!

(function () {
    // Detect if we're running locally
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '' || // file:// protocol
        hostname.startsWith('192.168.') || // local network
        hostname.startsWith('10.') || // local network
        hostname.endsWith('.local'); // .local domains

    let config;

    if (isLocal) {
        // Development Configuration
        console.log('🔧 Loading DEVELOPMENT configuration');
        // TODO: Add AUTH0_CLIENT_ID for local development
        config = {
            API_BASE_URL: `http://${hostname}:3000`,

            // Auth0 Configuration (replace with your Auth0 tenant values)
            AUTH0_DOMAIN: 'bubolazi.eu.auth0.com',         // e.g. dev-abc123.eu.auth0.com
            AUTH0_CLIENT_ID: 'e1qhxPEMMn7As6W5LIaCFnzowbgqh4vn',   // Lumi Application client_id
            AUTH0_AUDIENCE: 'https://api.bubolazi.com',     // API resource server identifier
            AUTH0_CALLBACK_URL: `http://${hostname}:8000/callback`,
            AUTH0_LOGOUT_URL: `http://${hostname}:8000`,
        };
    } else {
        // Production Configuration
        console.log('🚀 Loading PRODUCTION configuration');
        config = {
            API_BASE_URL: 'https://api.bubolazi.com',

            // Auth0 Configuration (replace with your Auth0 tenant values)
            AUTH0_DOMAIN: 'bubolazi.eu.auth0.com',         // e.g. bubolazi.eu.auth0.com
            AUTH0_CLIENT_ID: 'e1qhxPEMMn7As6W5LIaCFnzowbgqh4vn',   // Lumi Application client_id
            AUTH0_AUDIENCE: 'https://api.bubolazi.com',     // API resource server identifier
            AUTH0_CALLBACK_URL: `https://${hostname}/callback`,
            AUTH0_LOGOUT_URL: `https://${hostname}`,
        };
    }

    // Expose configuration globally
    window.LUMI_CONFIG = config;

    // Log the active configuration (helpful for debugging)
    console.log(`📍 Hostname: ${hostname}`);
    console.log(`⚙️  Environment: ${isLocal ? 'Development' : 'Production'}`);
    console.log(`🔗 API URL: ${config.API_BASE_URL}`);
    console.log(`🔐 Auth0 Domain: ${config.AUTH0_DOMAIN}`);
})();
