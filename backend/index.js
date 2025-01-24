const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server running on port 3000`)
});
app.get("/",(req,res)=>{
    res.send("Server running perfectly...")
})
app.post('/api/request', async (req, res) => {
    try {
        console.log("fkdfjkdf")
        const { method, url, headers, body } = req.body;
        const response = await axios({
            method,
            url,
            headers,
            data: body,
        });
        res.json({
            status: response.status,
            headers: response.headers,
            data: response.data,
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || null,
        });
    }
});


