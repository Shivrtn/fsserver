const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());

const fs = require('fs');
const filePath = 'financial_data.json';

// Helper function to read and parse JSON file
function readJsonFile(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      callback(err, null);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      callback(parseError, null);
    }
  });
}

app.get("/", (req, res) => {
  console.log('GET request received');
  readJsonFile((err, jsonData) => {
    if (!err) {
      res.json(jsonData);
    } else {
      res.status(500).send('Internal server error');
    }
  });
});

app.post("/post", (req, res) => {
  console.log('POST request received');
  readJsonFile((err, jsonData) => {
    if (!err) {
      // Assuming req.body contains JSON data to be appended or updated
      jsonData.push(req.body); // Modify as per your use case
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (!writeErr) {
          res.json(jsonData);
        } else {
          console.error('Error writing JSON file:', writeErr);
          res.status(500).send('Internal server error');
        }
      });
    } else {
      res.status(500).send('Internal server error');
    }
  });
});

const port = 2000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
