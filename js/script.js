document.addEventListener('DOMContentLoaded', function () {
    chargerCommandes();


    window.ajouterCommand = function () {
        const formulaire = document.getElementById('formulaire');
        formulaire.style.display = 'block';

        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
    };

    //fonction disparaitre formulaire

    const vanishBtn = document.getElementById("annulerCommandeBtn");
    vanishBtn.addEventListener('click',()=>{
        const formulaire = document.getElementById("formulaire");
        const overlay = document.getElementById("overlay");

        formulaire.style.display = "none";
        overlay.style.display ="none";
        resetFormulaire();
    })

    const addBtn = document.getElementById("validerCommandeBtn");
    addBtn.addEventListener('click', () => {

        ajouterCommande();
        const formulaire = document.getElementById("formulaire");
        const overlay = document.getElementById("overlay");

        formulaire.style.display = "none";
        overlay.style.display ="none";
        resetFormulaire();
    })

    // Fonction pour ajouter une commande
    function ajouterCommande() {
        // Récupérer les valeurs du formulaire
        const date = document.getElementById('date').value;
        const magasin = document.getElementById('magasin').value;
        const reference = document.getElementById('reference').value;
        const collaborateur = document.getElementById('collaborateur').value;
        const client = document.getElementById('nameClient').value;
        const contact = document.getElementById('contactClient').value;
        const secteur = document.getElementById('secteurForm').value;


        // Construire l'objet commande
        const commande = JSON.stringify({
            date: date,
            magasin: magasin,
            reference: reference,
            collaborateur: collaborateur,
            customer: client,
            contact: contact,
            sector: secteur,
        });

        // Envoyer la commande au serveur
        fetch('/addCommandes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: commande,
        })
            .then(response => response.json())
            .then(data => {

                chargerCommandes();
                resetFormulaire();
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la commande:', error);
                chargerCommandes();
            });
    }


    const secteurDropdown = document.getElementById('secteur');

// Ajoutez un écouteur d'événements de changement
    secteurDropdown.addEventListener('change', function() {
        // La fonction à exécuter lorsque le choix change


        chargerCommandes();


    });
    // Fonction pour charger les commandes depuis le serveur
    function chargerCommandes() {

        const secteur = document.getElementById('secteur').value;

        let url = '/loadCommandes';

        if (secteur !== "All") {
            url += `?secteur=${encodeURIComponent(secteur)}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(commandes => afficherCommandes(commandes))
            .catch(error => {
                console.error('Erreur lors de la récupération des commandes:', error);
                alert('Erreur lors de la récupération des commandes');
            });
    }

    // Fonction pour afficher les commandes dans le DOM
    function afficherCommandes(commandes) {
        const commandesList = document.getElementById('commandesList');
        commandesList.innerHTML = '';

        commandes.forEach(commande => {
            const commandeItem = `
        <div>
            <div class="commandeItem">
              <p><strong>Date:</strong> ${commande.date}</p>
              <p><strong>Magasin:</strong> ${commande.store}</p>
              <p><strong>Référence:</strong> ${commande.ref}</p>
              <p><strong>Collaborateur:</strong> ${commande.colab}</p>
              <p><strong>Client:</strong> ${commande.customer}</p>
              <p><strong>Contact:</strong><a href="tel:${commande.contact}"> ${commande.contact}</a> </p>
              <p><strong>Commentaire:</strong> ${commande.comment}</p>
              <button data-id="${commande._id}" class="ModifBtn">Modifier</button>
              <div class="actions">
                <div>
                    <label for="checkboxReceive-${commande._id}">Reçu :</label>
                    <input type="checkbox" id="checkboxReceive-${commande._id}" class="checkboxSupprimer">
                </div>
                <div>
                    <label for="checkboxCall-${commande._id}">Appelé :</label>
                    <input type="checkbox" id="checkboxCall-${commande._id}" class="checkboxSupprimer">
                </div>
              </div>
              
            </div>
            <button class="deleteBtn">Supprimer</button>
            <p>${commande.sector}</p>
        </div>
      `;
            commandesList.insertAdjacentHTML('beforeend', commandeItem);
        });

        document.querySelectorAll('.ModifBtn').forEach(button => {
            button.addEventListener('click', ()=>{
                afficherFormulaireModification(button.dataset.id);
            })
        })

        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', function () {
                const commandeId = button.previousElementSibling.querySelector('.checkboxSupprimer').id.split('-')[1];
                const receiveCheckbox = document.getElementById(`checkboxReceive-${commandeId}`);
                const callCheckbox = document.getElementById(`checkboxCall-${commandeId}`);

                if (receiveCheckbox.checked && callCheckbox.checked) {
                    // Les deux checkboxes sont cochées, supprimer la commande
                    supprimerCommande(commandeId);
                    // Ajouter le code pour supprimer la commande de la base de données
                } else {
                    // Afficher une alerte à l'utilisateur
                    alert('Veuillez cocher les deux checkboxes avant de supprimer la commande.');
                }
            });
        });

    }

    function verifierCheckboxes() {
        const checkboxes = document.querySelectorAll('.checkboxSupprimer');

        let receiveChecked = false;
        let callChecked = false;

        checkboxes.forEach(checkbox => {
            const commandeId = checkbox.id.split('-')[1]; // Récupérer l'ID de la commande depuis l'ID de la checkbox

            if (checkbox.id.startsWith('checkboxReceive') && checkbox.checked) {
                receiveChecked = true;
            } else if (checkbox.id.startsWith('checkboxCall') && checkbox.checked) {
                callChecked = true;
            }
        });

        if (receiveChecked && callChecked) {
            // Les deux checkboxes sont cochées, faire quelque chose

        }
    }

// Ajoutez un écouteur d'événements pour les checkboxes
    document.querySelectorAll('.checkboxSupprimer').forEach(checkbox => {
        checkbox.addEventListener('change', verifierCheckboxes);
    });

    // Fonction pour supprimer une commande
    function supprimerCommande(id) {
        fetch(`/deleteCommand/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {

                chargerCommandes();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la commande:', error);
                chargerCommandes();
            });
    }

    // Fonction pour réinitialiser le formulaire
    function resetFormulaire() {
        const formulaire = document.getElementById('formulaire');
        formulaire.style.display = 'none';

        // Réinitialiser les champs du formulaire
        document.getElementById('date').value = '';
        document.getElementById('magasin').value = '';
        document.getElementById('reference').value = '';
        document.getElementById('collaborateur').value = '';
        document.getElementById('nameClient').value = '';
        document.getElementById('contactClient').value = '';
    }

    // Ajouter un écouteur d'événements au bouton d'ajout de commande



    async function modifierCommentaire(reservationId, nouveauCommentaire) {
        try {
            const response = await fetch(`/command/${reservationId}/modifier`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: nouveauCommentaire }),
            });

            const data = await response.json();

            if (response.ok) {
                chargerCommandes();
                // Actualiser la liste des réservations ou effectuer d'autres actions si nécessaire
            } else {
                console.error(data.message);
                // Gérer les erreurs en conséquence
                chargerCommandes();
            }
        } catch (error) {
            console.error('Erreur lors de la modification du commentaire', error);
        }
    }

    // Fonction pour afficher le formulaire de modification
    async function afficherFormulaireModification(reservationId) {
        console.log(reservationId);
        const nouveauCommentaire = await prompt('Entrez le nouveau commentaire :');

        if (nouveauCommentaire !== null) {
            modifierCommentaire(reservationId, nouveauCommentaire);
        }
    }



});
