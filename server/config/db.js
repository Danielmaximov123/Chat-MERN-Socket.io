const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MongoDB).then(() => {
    console.log("MongoDB is connected");
}).catch((err) => {
    console.log(`MongoDB not Connected ${err}`);
})