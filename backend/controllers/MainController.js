const { spawn } = require("child_process");
const path = require("path");

const recommendCrop = async (state, season) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, "crop_yield.csv"); // Ensure the correct path
        const pythonProcess = spawn("python3", [path.join(__dirname, "crop_recommendation.py"), state, season, filePath]);
        
        let result = "";
        let error = "";

        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            error += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(result));
                } catch (err) {
                    reject({ error: "Failed to parse Python output", details: err.message });
                }
            } else {
                reject({ error: "Python script error", details: error });
            }
        });
    });
};

module.exports = { recommendCrop };
