module.exports = (app) => {
	// this is a single SPA webapp
    app.get('/', (req, res) => {
        res.render('index');
    });
};
