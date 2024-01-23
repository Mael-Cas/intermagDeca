document.addEventListener('DOMContentLoaded', function () {
    chargerCommandes();

    // Fonction pour afficher le formulaire
    function afficherFormulaire() {
        const formulaire = document.getElementById('formulaire');
        formulaire.style.display = 'block';
    }

    // Fonction pour ajouter une commande
    function ajouterCommande() {
        // Récupérer les valeurs du formulaire
        const date = document.getElementById('date').value;
        const magasin = document.getElementById('magasin').value;
        const reference = document.getElementById('reference').value;
        const collaborateur = document.getElementById('collaborateur').value;
        const texte = document.getElementById('texte').value;
        const commentaire = document.getElementById('commentaire').value;

        // Construire l'objet commande
        const commande = {
            date: date,
            magasin: magasin,
            reference: reference,
            collaborateur: collaborateur,
            texte: texte,
            commentaire: commentaire,
        };

        // Envoyer la commande au serveur
        fetch('/api/commandes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commande),
        })
            .then(response => response.json())
            .then(data => {
                alert('Commande ajoutée avec succès!');
                chargerCommandes();
                resetFormulaire();
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la commande:', error);
                alert('Erreur lors de l\'ajout de la commande');
            });
    }

    // Fonction pour charger les commandes depuis le serveur
    function chargerCommandes() {
        fetch('/api/commandes')
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
        <div class="commandeItem">
          <p><strong>Date:</strong> ${commande.date}</p>
          <p><strong>Magasin:</strong> ${commande.magasin}</p>
          <p><strong>Référence:</strong> ${commande.reference}</p>
          <p><strong>Collaborateur:</strong> ${commande.collaborateur}</p>
          <p><strong>Texte:</strong> ${commande.texte}</p>
          <p><strong>Commentaire:</strong> ${commande.commentaire}</p>
          <button onclick="modifierCommande('${commande._id}')">Modifier</button>
          <input type="checkbox" id="checkboxSupprimer-${commande._id}" class="checkboxSupprimer">
          <label for="checkboxSupprimer-${commande._id}">Supprimer</label>
        </div>
      `;
            commandesList.insertAdjacentHTML('beforeend', commandeItem);
        });

        // Ajouter des écouteurs d'événements pour les checkboxes de suppression
        document.querySelectorAll('.checkboxSupprimer').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    supprimerCommande(checkbox.id.split('-')[1]);
                }
            });
        });
    }

    // Fonction pour modifier une commande
    function modifierCommande(id) {
        // Implémentez la logique pour la modification de la commande ici
        // Vous pouvez afficher un autre formulaire avec les détails de la commande
    }

    // Fonction pour supprimer une commande
    function supprimerCommande(id) {
        fetch(`/api/commandes/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                chargerCommandes();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la commande:', error);
                alert('Erreur lors de la suppression de la commande');
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
        document.getElementById('texte').value = '';
        document.getElementById('commentaire').value = '';
    }

    // Ajouter un écouteur d'événements au bouton d'ajout de commande
    document.getElementById('ajouterCommandeBtn').addEventListener('click', ajouterCommande);
});
