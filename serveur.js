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






//main page
app.get('/',async (req, res) => {
    const main = await generateMain();
    res.send(main);
})

//schema mongo

const IntermagSchema = new mongoose.Schema({
    date: String,
    store: String,
    ref: String,
    colab: String,
    customer: String,
    contact: String,
    comment: String,
    sector: String,
});

const Intermag = mongoose.model('intermag', IntermagSchema);

app.post('/addCommandes', (req, res) => {

    const date = req.body.date;
    const store = req.body.magasin;
    const ref = req.body.reference;
    const collab = req.body.collaborateur;
    const customer = req.body.customer;
    const contact = req.body.contact;
    const comment = "";
    const sector = req.body.sector;

    const newIntermag = new Intermag({
        date: date,
        store: store,
        ref: ref,
        colab: collab,
        customer: customer,
        contact: contact,
        comment: comment,
        sector: sector,
    });
    try {
        newIntermag.save();
        res.status(200).send();
    }catch (error){
        console.log(error);
        res.status(500).send();
    }
})

// Route pour récupérer toutes les réservations
app.get('/loadCommandes', async (req, res) => {
    try {
        let filter = {};

        const secteur = req.query.secteur;
        console.log(secteur)

        if (secteur !== undefined) {
            // Ajoutez le filtre uniquement si secteur n'est pas undefined
            filter = { sector: secteur };
            console.log(filter)
        }

        const data = await Intermag.find(filter);

        res.send(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).send('Erreur lors de la récupération des commandes');
    }
});

app.delete('/deleteCommand/:id', async (req, res) => {
    const reservationId = req.params.id;
    console.log(reservationId);
    const result = await Intermag.findByIdAndDelete(reservationId);
    res.status(200).send();
});


app.put('/command/:id/modifier', async (req, res) => {
    try {
        const reservationId = req.params.id;
        const nouveauCommentaire = req.body.comment;

        console.log(reservationId);
        console.log(nouveauCommentaire);

        const update = await Intermag.findByIdAndUpdate( reservationId, {comment: nouveauCommentaire});



        res.status(200).json({ message: 'Commentaire modifié avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification du commentaire' });
    }
});


// Port d'écoute du serveur
const port = process.env.PORT || 10003;
app.listen(port, () => {
    console.log(`serveur démarré : http://localhost:${port}`)
});
