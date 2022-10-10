// esbuild.config.js
module.exports = (serverless) => ({
    bundle: true,
    minify: false,
    sourcemap: true,
    concurrency: 25,
    exclude: ['aws-sdk'],
    target: 'node14',
    packagePath: './package.json',
    packager: 'npm',
    define: { 'require.resolve': undefined },    
});