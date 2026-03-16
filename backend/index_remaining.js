require("dotenv").config();
const path = require("path");
const { indexDocument } = require("./services/studyMaterialIndex.service");

(async () => {
    const englishFile = path.join(__dirname, "uploads/study-materials/class10/english/1768797799584_Class_10_English_English_Medium-2024_Edition-www.tntextbooks.in.pdf");
    const socialScienceFile = path.join(__dirname, "uploads/study-materials/class10/socialscience/1768798823449_Class_10_Social_Science_English_Medium-2025_Edition-www.tntextbooks.in.pdf");
    const tamilFile = path.join(__dirname, "uploads/study-materials/class10/tamil/1768782561245_Class_10_Tamil_Tamil_Medium-2025_Edition-www.tntextbooks.in.pdf");

    console.log("Starting English indexing...");
    await indexDocument(englishFile, { subject: "English", class_level: "10" });
    console.log("English indexing complete.");

    console.log("Starting Social Science indexing...");
    await indexDocument(socialScienceFile, { subject: "Social Science", class_level: "10" });
    console.log("Social Science indexing complete.");

    console.log("Starting Tamil indexing...");
    await indexDocument(tamilFile, { subject: "Tamil", class_level: "10" });
    console.log("Tamil indexing complete.");

})();
