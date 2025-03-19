const csv = require("csvtojson");
const path = require("path");

const filePath = path.join(__dirname, "./crop_yield.csv"); 

const recommendCrop = async (state, season) => {
    try {
        const data = await csv().fromFile(filePath);
        const filteredData = data.filter(row => 
            row.State.toLowerCase() === state.toLowerCase() &&
            row.Season.toLowerCase() === season.toLowerCase()
        );

        if (filteredData.length === 0) {
            return { message: `No crop data available for ${state} in ${season}.` };
        }
        const cropYields = {};
        filteredData.forEach(row => {
            if (!cropYields[row.Crop]) {
                cropYields[row.Crop] = { totalYield: 0, count: 0 };
            }
            cropYields[row.Crop].totalYield += parseFloat(row.Yield);
            cropYields[row.Crop].count += 1;
        });

        let bestCrop = "";
        let maxYield = 0;
        for (let crop in cropYields) {
            let avgYield = cropYields[crop].totalYield / cropYields[crop].count;
            if (avgYield > maxYield) {
                maxYield = avgYield;
                bestCrop = crop;
            }
        }
        return { state, season, recommendedCrop: bestCrop || "Dummy Crop" };

    } catch (error) {
        console.error("Error processing crop recommendation:", error);
        return { error: "Error processing data", details: error.message };
    }
};

module.exports = { recommendCrop };
