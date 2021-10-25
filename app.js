const express = require('express');
const dbConn = require('./config/db.con');
const fs = require('fs');
const app = express();
const logger = require('./middleware/logger')
const contactRoutes = require('./routes/contacts');
const cors = require('cors');
const authorRoutes = require('./routes/author');
const port = process.env.PORT || 4000;


const corsOption = {
    "origin": "*"
}
app.use(cors(corsOption));
app.use(logger);
app.use(express.json());
app.use('/api/contact', contactRoutes);
app.use('/api/user', authorRoutes);
dbConn();

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})