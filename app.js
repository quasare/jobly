/** Express app for jobly. */
const express = require('express');

const morgan = require('morgan');
const {
  authenticateJWT,
} = require('./middleware/auth');

const app = express();

app.use(express.json());

// add logging system
app.use(morgan('tiny'));

const ExpressError = require('./helpers/expressError');

// Routes imported for app
const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Initilize auth for entire app
app.use(authenticateJWT);

// Initialize routes in app
app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);
app.use('/', authRoutes);

/** 404 handler */

app.use((req, res, next) => {
  const err = new ExpressError('Not Found', 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
