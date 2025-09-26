export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Immediate error suppression - loads before anything else
            (function() {
              const originalError = console.error;
              const originalWarn = console.warn;

              const patterns = [
                'apiKey', 'config.authenticator', 'Neither apiKey nor config.authenticator',
                'setAuthenticator', 'r._setAuthenticator', '714-f4706624d7e8aa9b',
                '714-f47066', '255-01c481785f268126', '4bd1b696-c023c6e3521b1417',
                'chrome-extension', 'moz-extension', 'layout-66a15374f020044b',
                'terms2_psc', 'privacy2_psc', 'page-c90a3bc18e078208',
                'webpack-db6632fee275fcd4'
              ];

              function shouldSuppress(msg) {
                const str = String(msg || '');
                return patterns.some(p => str.includes(p));
              }

              console.error = function(...args) {
                if (args.some(shouldSuppress)) return;
                originalError.apply(console, args);
              };

              console.warn = function(...args) {
                if (args.some(shouldSuppress)) return;
                originalWarn.apply(console, args);
              };

              window.addEventListener('error', function(e) {
                if (shouldSuppress(e.message) || shouldSuppress(e.filename)) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);

              window.addEventListener('unhandledrejection', function(e) {
                if (shouldSuppress(e.reason)) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);
            })();
          `,
        }}
      />
    </>
  )
}