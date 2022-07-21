const express = require('express');
const app = express();
const credData = require('./routes/todo');
const adminData = require('./routes/admin');

app.use(express.json());

app.use('/todo', credData);
app.use('/admin', adminData);

app.listen(3000);