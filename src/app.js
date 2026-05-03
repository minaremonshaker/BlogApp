
import UserRouter from "./routes/Users.js";
import AuthRouter from "./routes/Auth.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import pageNotFoundError from "./middlewares/pageNotFoundHandler.js";


const bootstrap = async (app,express) => {
  app.use(express.json());

  // Root route
  app.get("/", (req, res) => {
    res.json({ message: "Blog API is running", routes: ["/auth", "/users"] });
  });

  app.use("/auth", AuthRouter);
  app.use("/users", UserRouter);


  // 404 handler - must come after all other routes
  app.use(pageNotFoundError);
  app.use(globalErrorHandler);
};

export default bootstrap;
