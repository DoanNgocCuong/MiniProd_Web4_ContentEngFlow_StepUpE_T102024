// javascript:backend/src/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/questions', questionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

