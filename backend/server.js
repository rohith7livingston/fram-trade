const {app} = require("./app");
const mongoose = require("mongoose")
const port = 3000;


mongoose.connect("mongodb://localhost:27017/farm-trade")
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));

        
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
