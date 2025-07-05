let app = require("./src/app.js");
let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server started on port " + port);
});
