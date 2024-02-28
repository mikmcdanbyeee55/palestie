const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const express = require('express');
const cors = require('cors');  // Import the 'cors' middleware

const magnetLink = 'magnet:?xt=urn:btih:382EFEE548A0A7502E23CE09E5A6550F724E5F0D';

const manifest = {
    id: 'custom-addon',
    version: '1.0.0',
    name: 'Custom Addon',
    description: 'Addon serving a collection of videos with a single magnet link',
    resources: ['catalog'],
    types: ['movie'],
    idProperty: 'imdb',
    catalogs: [
        {
            id: 'custom-catalog',
            name: 'Custom Catalog',
            type: 'movie'
        }
    ]
};

const generateCatalog = () => {
    const catalog = [];
    for (let i = 1; i <= 60; i++) {
        const content = {
            id: `custom-addon:${i}`,
            type: 'movie',
            name: `Video ${i}`,
            poster: `https://example.com/poster${i}.jpg`, 
            magnet: magnetLink,
        };
        catalog.push(content);
    }
    return catalog;
};

const catalogHandler = async (args) => {
    const catalog = generateCatalog();
    return Promise.resolve({ metas: catalog });
};

const addon = new addonBuilder(manifest)
    .defineCatalogHandler(catalogHandler);

const app = express();
const PORT = process.env.PORT || 7000;

// Use the 'cors' middleware
app.use(cors());

app.use('/manifest.json', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(addon.getInterface());
});

app.listen(PORT, () => {
    console.log(`Addon server is running at http://localhost:${PORT}`);
});
