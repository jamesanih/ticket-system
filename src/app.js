const express = require('express');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const swagger = require('./utils/swagger');

const app = express();

app.use(express.json());

app.use('/api-docs', swagger.serve, swagger.setup);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);


app.use(errorHandler);

module.exports = app;