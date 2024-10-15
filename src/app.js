const express = require('express');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const swagger = require('./utils/swagger');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());

app.use('/api-docs', swagger.serve, swagger.setup);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  logger.info('Handling request for root route');
  res.send('Hello, World!');
});

app.use((err, req, res, next) => {
  logger.error('An error occurred', { error: err.message, stack: err.stack });
  res.status(500).send('Something went wrong');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
