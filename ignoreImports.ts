[
    '.css',
    '.scss',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
].forEach( ext => require.extensions[ext] = () => true )
