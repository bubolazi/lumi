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
        config = {
            // API Configuration
            API_BASE_URL: 'http://localhost:3000',

            // Cloudflare Turnstile Configuration
            TURNSTILE_SITE_KEY: '1x00000000000000000000AA', // Test key
        };
    } else {
        // Production Configuration
        console.log('🚀 Loading PRODUCTION configuration');
        config = {
            // API Configuration
            API_BASE_URL: 'https://api.bubolazi.com',

            // Cloudflare Turnstile Configuration
            TURNSTILE_SITE_KEY: '0x4AAAAAACBMVCK4HE7B42vy', // Real production key
        };
    }

    // Expose configuration globally
    window.LUMI_CONFIG = config;

    // Log the active configuration (helpful for debugging)
    console.log(`📍 Hostname: ${hostname}`);
    console.log(`⚙️  Environment: ${isLocal ? 'Development' : 'Production'}`);
    console.log(`🔗 API URL: ${config.API_BASE_URL}`);
})();
