const PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes");

app.use(routes);
app.use(cors);

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
});
