// install express & dependancies
var ejs           = require("ejs"),
    faker         = require("faker"),
    express       = require("express"),
    passport      = require("passport"),
    mongoose      = require("mongoose"),
    seedDB        = require("./seed.js"),
    bodyParser    = require("body-parser"),
    User          = require("./models/user"),
    LocalStrategy = require("passport-local");


mongoose.connect(process.env.DATABASEURL);

//////////////////////////////////////////////////////////////////
////////////Initialize express
//////////////////////////////////////////////////////////////
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.bodyParser());

// seedDB();

//////////////////////////////////////////////////////////////////
////////////Passport configuration
//////////////////////////////////////////////////////////////
app.use(require("express-session")({
    secret: process.env.OURSECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//////////////////////////////////////////////////////////////////
////////////Auth routes
//////////////////////////////////////////////////////////////

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

// registration logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
            console.log("register success");
        });
    });
})

// show login form
app.get("/login", function(req,res){
    res.render("login");
});


// login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }), function(req, res){
    
})

// logout route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

// middleware to check if user is authenticated
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//////////////////////////////////////////////////////////////////
////////////Other routes
//////////////////////////////////////////////////////////////

//  "/" => render index view
app.get("/", function(req, res){
   res.render('index');
});

// route for testing authentication
app.get("/secret",isLoggedIn, function(req, res){
   res.render('secret');
});

// Catch all
app.get("*", function(req, res){
   res.send("The path doesn't exist");
});

//////////////////////////////////////////////////////////////////
//////////// Tell Express to listen for requests (start server)
//////////////////////////////////////////////////////////////

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
}); 