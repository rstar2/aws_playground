const path = require('path');

const express = require('express');

const app = express();
// from Express 4.16 they are back in the core
app.use(express.urlencoded({ extended: false, }));
app.use(express.json());

// configure routes
const authRouter = express.Router();
require('./routes/auth')(authRouter);
app.use('/auth', authRouter);

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);
