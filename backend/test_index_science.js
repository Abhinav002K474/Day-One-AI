require("dotenv").config();
const path = require("path");
const { indexDocument } = require("./services/studyMaterialIndex.service");

(async () => {
    try {
        const filePath = path.join(
            __dirname,
            "uploads/study-materials/class10/science/1768798311154_Class_10_Science_English_Medium-2024_Edition-www.tntextbooks.in.pdf"
        );

        console.log("Indexing file:", filePath);

        await indexDocument(filePath, {
            subject: "Science",
            class_level: "10"
        });

        console.log("Science indexing complete");
    } catch (err) {
        console.error("Error during indexing:", err);
    }
})();
