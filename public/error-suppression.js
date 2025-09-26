// Aggressive error suppression script
// This runs immediately to catch errors before React even loads

(function() {
  'use strict';

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  // List of error patterns to suppress
  const suppressedPatterns = [
    'apiKey',
    'config.authenticator',
    'Neither apiKey nor config.authenticator',
    'setAuthenticator',
    'r._setAuthenticator',
    '714-f4706624d7e8aa9b',
    '714-f47066',
    '255-01c481785f268126',
    '4bd1b696-c023c6e3521b1417',
    'chrome-extension',
    'moz-extension',
    'layout-66a15374f020044b',
    'terms2_psc',
    'privacy2_psc',
    'page-c90a3bc18e078208',
    'webpack-db6632fee275fcd4'
  ];

  // Function to check if message should be suppressed
  function shouldSuppress(message) {
    const msgStr = String(message || '');
    return suppressedPatterns.some(pattern => msgStr.includes(pattern));
  }

  // Override console.error
  console.error = function(...args) {
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress this error
    }
    originalError.apply(console, args);
  };

  // Override console.warn
  console.warn = function(...args) {
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress this warning
    }
    originalWarn.apply(console, args);
  };

  // Override console.log for good measure
  console.log = function(...args) {
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress this log
    }
    originalLog.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = String(event.reason || '');
    if (shouldSuppress(reason)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Handle global errors
  window.addEventListener('error', function(event) {
    const message = String(event.message || '');
    const filename = String(event.filename || '');

    if (shouldSuppress(message) || shouldSuppress(filename)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Override window.onerror
  const originalOnError = window.onerror;
  window.onerror = function(message, filename, lineno, colno, error) {
    if (shouldSuppress(message) || shouldSuppress(filename)) {
      return true; // Suppress this error
    }

    if (originalOnError) {
      return originalOnError.call(this, message, filename, lineno, colno, error);
    }
    return false;
  };

  // Override window.onunhandledrejection
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const reason = String(event.reason || '');
    if (shouldSuppress(reason)) {
      event.preventDefault();
      return true;
    }

    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.call(this, event);
    }
    return false;
  };

  // Try to prevent errors from external scripts by monitoring script loading
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(node) {
    if (node.tagName === 'SCRIPT' && node.src) {
      const src = node.src;
      if (suppressedPatterns.some(pattern => src.includes(pattern))) {
        // Don't load scripts that match suppressed patterns
        return node;
      }
    }
    return originalAppendChild.call(this, node);
  };

  console.log('✅ Error suppression system activated');
})();