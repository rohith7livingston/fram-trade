const csv = require("csvtojson");
const path = require("path");

const filePath = path.join(__dirname, "crop_yield.csv");

const recommendCrop = async (state, season) => {
    try {
        const data = await csv().fromFile(filePath);
        const filteredData = data.filter(row => row.State === state && row.Season === season);
        if (filteredData.length === 0) {
            return { message: `No crop data available for ${state} in ${season}.` };
        }
        // Finding...
        const cropYields = {};
        filteredData.forEach(row => {
            if (!cropYields[row.Crop]) {
                cropYields[row.Crop] = { totalYield: 0, count: 0 };
            }
            cropYields[row.Crop].totalYield += parseFloat(row.Yield);
            cropYields[row.Crop].count += 1;
        });
        // Get the best crop based on trainded modle(check using dataset)
        let bestCrop = "";
        let maxYield = 0;
        for (let crop in cropYields) {
            let avgYield = cropYields[crop].totalYield / cropYields[crop].count;
            if (avgYield > maxYield) {
                maxYield = avgYield;
                bestCrop = crop;
            }
        }
        return { state, season, recommendedCrop: bestCrop };
    } catch (error) {
        return { error: "Error reading the dataset", details: error.message };
    }
};

module.exports = { recommendCrop };
