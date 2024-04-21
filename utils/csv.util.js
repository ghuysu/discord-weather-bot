const fs = require("fs").promises;
const path = require("path");

const checkLocationInCSV = async (location) => {
    const filePath = path.resolve(__dirname, "location.csv");

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n');

        for (const line of lines) {
            const _location = line.split(", ")[0]
            const key = line.split(", ")[1]

            if (_location === location) {
                console.log({line: line})
                return key
            }
        }
        return false;
    } catch (error) {
        console.error("Error reading file:", error);
        return false;
    }
}

const addLocationKeyToCSV = async ({location, key}) => {
    const filePath = path.resolve(__dirname, "location.csv");

    try {
        await fs.appendFile(filePath, location +", " + key + '\n');
        console.log("Location key added successfully.");
    } catch (error) {
        console.error("Error appending to file:", error);
    }
}

module.exports = {
    checkLocationInCSV,
    addLocationKeyToCSV
}
