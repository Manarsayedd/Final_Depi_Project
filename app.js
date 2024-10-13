import express from 'express';
import session from 'express-session';
import studentRoutes from './routes/studentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js'; // Added teacher routes
import dotenv from 'dotenv';
import path from 'path';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes); // Use teacher routes

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("home", { username: req.session.user.username });
});

app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found!" });
});

export default app;
