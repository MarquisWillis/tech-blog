// include middleware and express helper libraries
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

// import routes and custom helper functions
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// import sequelize connection and store cookie session libraries/functions
const sequelize = require('./config/connection');
const sequelizeStore = require('connect-session-sequelize')(session.Store);

// decalare app as an express app, used on a variable PORT or 3001 by default
const app = express();
const PORT = process.env.PORT || 3001;

// initialize express middleware helper functions (handlebars)
const hbs = exphbs.create({ helpers });

// declares cookie session middleware and session settings
const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db: sequelize
    })
};

// tells express app to use session middleware for cookie
app.use(session(sess));

// inform express to use the handlebars engine and sets it
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// sets up app to return and parse json data, encode url, and 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// tells app to use routes from controllers folder
app.use(routes);

// initiates sequelize connection to database and to the app. t
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App now listening`));
});