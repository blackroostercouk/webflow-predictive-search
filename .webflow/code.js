module.exports = {
  buildCommand: 'npm run build',
  outputDirectory: '.cf-pages',
  environmentVariables: {
    // Ensure we're in production mode
    NODE_ENV: 'production',
    // Disable Vercel integrations
    VERCEL: '0',
    NOW_BUILDER: '0',
    NEXT_TELEMETRY_DISABLED: '1',
    // Use standalone output
    NEXT_OUTPUT: 'standalone'
  }
}
