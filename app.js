const express = require('express');
const pool = require("./db");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

app.get('/getIndices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Quarterly_Indices_2022_byPropertyType"');

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getIndicesbyRegionhouse', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "House_Quarterly_Indices_2022_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getIndicesbyRegionapart', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Apartment_Quarterly_Indices_2022_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getcountsbyRegion', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "CountsAndWeights_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/gettimedummy', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TDHM_Indices"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/posttimedummy', async (req, res) => {
    const createTableText = `
        CREATE TABLE IF NOT EXISTS public."TDHM_Indices" (
            "Quarter" text,
            "Houses" double precision,
            "Apartments" double precision,
            "Aggregated Index" double precision
        );
    `;

    const insertDataText = `
        INSERT INTO public."TDHM_Indices" ("Quarter", "Houses", "Apartments", "Aggregated Index")
        VALUES ($1, $2, $3, $4);
    `;

    try {
        // Connect to the pool and create the table if it doesn't exist
        await pool.query(createTableText);

        console.log("req.body",req.body)

        // Destructure your data from the request body
        const { Quarter, Houses, Apartments, AggregatedIndex } = req.body;

        // Insert the data into the table
        const result = await pool.query(insertDataText, [Quarter, Houses, Apartments, AggregatedIndex]);

        // Send back the result
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







app.get('/', async (req, res) => {
    try {
       res.status(200).json({success: true, message:"welcome to the application"});
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
