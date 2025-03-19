const express = require('express')
const cors = require('cors');
const {getWeather} = require("./controllers/weathercontroller");
const {recommendCrop} = require("./controllers/MainController")

const app = express();

app.use(cors());
app.use(express.json());


app.post("/getWeather",getWeather);
app.post("/recommend-crop", async (req, res) => {
    const { state, season } = req.body;
    if (!state || !season) {
        return res.status(400).json({ error: "State and season are required." });
    }

    const result = await recommendCrop(state, season);
    res.json(result);
});
module.exports = {app}