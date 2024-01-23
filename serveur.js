const express = require('express');
const mongoose = require('mongoose');


// Initialisation de l'application Express
const app = express();

// Configuration de body-parser pour traiter les données JSON
app.use(express.json())
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
const generateMain = require("./getMainHtml.js")



// Connexion à la base de données MongoDB (assurez-vous d'avoir MongoDB installé localement)
async function connect() {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/decathlon`);
    } catch (error) {
        console.log(error);
    }
}
connect();







app.get('/',async (req, res) => {
    const main = await generateMain();
    res.send(main);
})



// Port d'écoute du serveur
const port = process.env.PORT || 10003;
app.listen(port, () => {
    console.log(`serveur démarré : http://localhost:${port}`)
});
