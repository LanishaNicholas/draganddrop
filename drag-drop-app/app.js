const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3001;

// Connect to MySQL database
const sequelize = new Sequelize("dragDropDB", "root", "", {
    host: "localhost",
    port: 3307, // Adjust if using a different port
    dialect: "mysql",
});

// Define File model
const File = sequelize.define("File", {
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
    },
}, {
    timestamps: false, // Disable createdAt and updatedAt fields
});

// Sync model with database
sequelize.sync()
    .then(() => console.log("Database & tables created!"))
    .catch(error => console.error("Error syncing database:", error));

// Serve static files
app.use(express.static("public"));

// Configure multer for file handling (storing file in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        await File.create({
            filename: originalname,
            data: buffer,
        });

        res.status(200).send("File uploaded and saved to database successfully!");
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send("Error uploading file.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});