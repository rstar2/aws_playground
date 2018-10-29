module.exports = (app) => {

    app.post('/register', (req, res) => {
        dbConnect()
            .then(db => db.register(req.body))
            .then(user => jwt.sign(user.id))
            .then(token => {
                console.log('Newly registered user');
                res.send({ auth: true, token, });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send({ auth: false, error, });
            });
    });

    app.post('/login', (req, res) => {
        dbConnect()
            .then(db => db.login(req.body))
            .then(user => jwt.sign(user.id))
            .then(token => {
                console.log('Newly logged in user');
                res.send({ auth: true, token, });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send({ auth: false, error, });
            });
    });
};
