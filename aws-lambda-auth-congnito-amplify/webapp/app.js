const path = require('path');

const express = require('express');
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    defaultLayout: false,   // no layout by default
    extname: '.hbs',
});

/**
 * Factory method
 * @return {Express.Application}}
 */
module.exports = (stage) => {
    const app = express();
    // the root folder for the template views
    app.set('views', path.join(__dirname, 'views'));
    // Register `hbs` as our view engine using its bound `engine()` function.
    app.engine('hbs', hbs.engine);
    // use the Handlebars engine
    app.set('view engine', 'hbs');

    // from Express 4.16 they are back in the core
    app.use(express.urlencoded({ extended: false, }));
    app.use(express.json());

    app.use('/public', express.static(path.join(__dirname, 'public')));

    // configure routes
    const viewsRouter = express.Router();
    require('./routes/views')(viewsRouter);
    app.use('/', viewsRouter);

    return app;
};
