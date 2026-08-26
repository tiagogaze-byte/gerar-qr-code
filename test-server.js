console.log('Test file:', require.main.filename);
console.log('Index file:', require('./index.js') ? 'loaded' : 'not loaded');
