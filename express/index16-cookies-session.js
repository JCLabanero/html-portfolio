import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { Strategy } from "passport-local";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use(
  session({
    secret: process.env.SESSION_SECRET, //KEY to sign the session cookie
    resave: false, //Forces the session to be saved back to the session store
    //Even if server reset, update server and still would work
    saveUninitialized: true, //Whether we want to force a session to be save to store
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //One day length cookie
    },
  })
);

//TODO: SHOULD USE SESSION FIRST BEFORE THIS ONE 96

app.use(passport.initialize());
app.use(passport.session());

//TODO: STRATEGY LINE

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("cookies-session-home.ejs");
});

app.get("/submit", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("cookies-session-submit.ejs");
  } else res.redirect("/login");
});

app.get("/secrets", async (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    const result = await db.query("SELECT secret from users WHERE email=$1", [
      req.user.email,
    ]);
    let secret = "Jack Bauer is my hero";
    if (result.rowCount > 0 && result.rows[0].secret != null) {
      secret = result.rows[0].secret;
    }
    res.render("cookies-session-secrets.ejs", {
      secret: secret,
    });
  } else res.redirect("/login");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/login", async (req, res) => {
  res.render("cookies-session-login.ejs");
});

app.get("/register", (req, res) => {
  res.render("cookies-session-register.ejs");
});

app.post("/submit", async (req, res) => {
  console.log(`OUTPUT: ${req.body.secret}, ${req.user.email}`);
  try {
    const secret = await db.query("UPDATE users SET secret=$1 WHERE email=$2", [
      req.body.secret,
      req.user.email,
    ]);
    res.redirect("/secrets");
  } catch (error) {
    console.log(err);
    res.redirect("/secrets");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log(err);
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    console.log(`${username}, ${password}`);
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              res.render("secrets.ejs");
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rowCount === 0) {
          const newUser = await db.query(
            "INSERT INTO users(email,password) VALUES ($1,$2)",
            [profile.email, "google"]
          );
          cb(null, newUser.rows[0]);
        } else {
          cb(null, result.rows[0]);
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
