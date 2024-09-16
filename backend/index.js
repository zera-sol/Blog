const express = require('express');
const app = express();
const usersRoute = require('./Routes/usersRoute');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/users', usersRoute);

app.listen(5000, () => {
  console.log('Server is running on port 3000');
});