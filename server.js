// server.js
const app = require("./index");
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server up and running: ${PORT}`);
});
