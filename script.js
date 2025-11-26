/*** Création des variables et constantes ***/

// Le panier en cours
let panier = {};

// L'historique des commandes
let historique = JSON.parse(localStorage.getItem('historique') || '[]');

// Les produits avec les prix
// Alimentaire
const objetProduits1 = {
	"Café" : {
		prix : 2,
		image : "cafe.png"
	},
	"Crêpe caramel" : {
		prix : 2,
		image : "crepe_caramel.png"
	},
	"Crêpe chocolat" : {
		prix : 2,
		image : "crepe_chocolat.png"
	},
	"Crêpe sucre" : {
		prix : 1,
		image : "crepe_sucre.png"
	},
	"Gâteau" : {
		prix : 1,
		image : "gateau.png"
	},
	"Thé" : {
		prix : 2,
		image : "the.png"
	},
	"Vin chaud" : {
		prix : 3,
		image : "vin_chaud.png"
	}
};
// Autre
const objetProduits2 = {
	"Bijou" : {
		prix : 5,
		image : "bijou.png"
	},
	"Bougie" : {
		prix : 5,
		image : "bougie.png"
	},
	"Décoration" : {
		prix : 5,
		image : "decoration.png"
	},
	"Jacinthe" : {
		prix : 5,
		image : "jacinthe.png"
	},
	"Marionnette DIY" : {
		prix : 5,
		image : "marionnette.png"
	},
	"Mug" : {
		prix : 5,
		image : "mug.png"
	},
	"Porte-clé" : {
		prix : 5,
		image : "porte_cle.png"
	}
};

/*** Affichages dynamiques ***/

// Génération des boutons pour ajouter des produits au panier en cours
const chemin = window.location.pathname;
if(chemin.includes('caisse_alimentation.html')){
	genererBoutonsProduits(objetProduits1, "liste_produits_1");
}
else if(chemin.includes('caisse_marche_de_noel.html')){
	genererBoutonsProduits(objetProduits2, "liste_produits_2");
}

// Affichage de l'historique des commandes
afficherHistorique();

// Charger les préférences
if (localStorage.getItem("modeNuit") === "true"){
	document.body.classList.add("mode_nuit");
	document.getElementById("bouton_mode_nuit").innerHTML = '<span class="bouton_mode_nuit_texte">Mode jour</span><span class="bouton_mode_nuit_icone">&#9728;</span>';
}
else{
	document.getElementById("bouton_mode_nuit").innerHTML = '<span class="bouton_mode_nuit_texte">Mode nuit</span><span class="bouton_mode_nuit_icone">&#9789;</span>';
}

/*** Fonctions ***/

/** Éviter les clics intempestifs **/

let deniere_action = 0;
const DELAI_MINIMUM = 150;

function clicEstAutorise(){
	const maintenant = Date.now();
	if(maintenant - deniere_action < DELAI_MINIMUM){
		return false;
	}
	deniere_action = maintenant;
	return true;
}

/** Panier **/

// Générer les boutons permettant d'ajouter un produit au panier
function genererBoutonsProduits(objet_produits, id_produits){
	const div = document.getElementById(id_produits);
	div.innerHTML = "";
	
	for(const nom in objet_produits){
		const bouton = document.createElement("button");
		bouton.textContent = `${nom} - ${objet_produits[nom].prix}€`;
		bouton.innerHTML = `<span class="produit_nom">${nom}</span><img src="images/${objet_produits[nom].image}" alt="" class="produit_icone" />${objet_produits[nom].prix} €`;
		bouton.addEventListener('click', function(){
			ajouterProduit(nom, objet_produits[nom].prix);
		});
		
		div.appendChild(bouton);
	}
}

// Ajouter un nouvel article
function ajouterProduit(nom, prix){
	if (!panier[nom]){
		panier[nom] = {
			quantite: 0,
			prix: prix
		};
	}
	panier[nom].quantite++;
	afficherPanier();
}

// Diminuer la quantité d'un article
function diminuerQuantiteProduit(nom){
	if (!panier[nom]){
		return;
	}
	panier[nom].quantite--;
	if(panier[nom].quantite <= 0){
		delete panier[nom];
	}
	afficherPanier();
}

// Augmenter la quantité d'un article
function augmenterQuantiteProduit(nom){
	panier[nom].quantite++;
	afficherPanier();
}

// Mettre l'affichage du panier à jour
function afficherPanier(){
	const divPanier = document.getElementById('panier');
	divPanier.innerHTML = '';
	let total = 0;
	
	for(let produit in panier){
		const ligne = document.createElement('div');
		ligne.className = 'ligne_produit';
		const soustotal = panier[produit].quantite * panier[produit].prix;
		total += soustotal;
		const texte = document.createElement('span');
		texte.innerHTML = `
			<span>
				${panier[produit].quantite}x ${produit}
			</span>
			<span class="ligne_produit_total">
				= ${soustotal.toFixed(2)}€
			</span>
		`;
		const boutons = document.createElement('div');
		const bouton_moins = document.createElement('button');
		bouton_moins.className = "moins";
		bouton_moins.type = "button";
		bouton_moins.textContent = "-";
		bouton_moins.addEventListener('click', function(){
			if(!clicEstAutorise()){
				return;
			}
			diminuerQuantiteProduit(produit);
		});
		boutons.appendChild(bouton_moins);
		const bouton_plus = document.createElement('button');
		bouton_plus.className = "plus";
		bouton_plus.type = "button";
		bouton_plus.textContent = "+";
		bouton_plus.addEventListener('click', function(){
			if(!clicEstAutorise()){
				return;
			}
			augmenterQuantiteProduit(produit);
		});
		boutons.appendChild(bouton_plus);
		ligne.appendChild(texte);
		ligne.appendChild(boutons);
		divPanier.appendChild(ligne);
	}
	
	document.getElementById('total').textContent = total.toFixed(2);
}

// Valider le panier en cours
function validerPanier(){
	if (Object.keys(panier).length === 0) return;
	
	const commande = {
		id: historique.length + 1,
		produits: JSON.parse(JSON.stringify(panier)),
		total: parseFloat(document.getElementById('total').textContent),
		temps: new Date().toLocaleTimeString('fr-FR')
	};
	
	historique.unshift(commande);
	sauvegarderHistorique();
	afficherHistorique();
	panier = {};
	afficherPanier();
}

// Annuler le panier en cours
function confirmerSuppressionPanier(){
	// Suppression
	panier = {};
	afficherPanier();
	// Fermer la popup
	fermerPopupViderCommande();
}

/** Commande **/

// Afficher le détail des produits d'une commande
function afficherDetailCommande(liste_produits){
	return Object.entries(liste_produits)
		.map(([nom, informations]) => `${informations.quantite}x ${nom}`)
		.join(", ");
}

/** Historique **/

// Afficher l'historique des commandes
function afficherHistorique(){
	const divHistorique = document.getElementById('historique');
	divHistorique.innerHTML = '';
	
	historique.forEach(commande => {
		const ligne = document.createElement('div');
		ligne.className = 'ligne_commande';
		const details = afficherDetailCommande(commande.produits);
		ligne.innerHTML = `<b>Commande #${commande.id}</b> — ${commande.total.toFixed(2)}€ — ${commande.temps} (${details})`;
		divHistorique.appendChild(ligne);
	});
	
	// Affichage du récapitulatif
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	let texte_recapitulatif = "<h4>Alimentation</h4>";
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		if(nom === Object.keys(objetProduits2)[0]){
			texte_recapitulatif += `<h4>Autre</h4>`;
		}
		texte_recapitulatif += `${nom} : ${quantite}<br />`;
	});
	
	document.getElementById("recapitulatifProduits").innerHTML = texte_recapitulatif;
	document.getElementById("totalCumule").textContent = historique.reduce((somme, commande) => somme + commande.total, 0).toFixed(2);
}

// Sauvegarder l'historique
function sauvegarderHistorique(){
	localStorage.setItem('historique', JSON.stringify(historique));
}

// Annuler la dernière commande de l'historique
function confirmerSuppressionDerniereCommandeHistorique(){
	if(historique.length ===0){
		fermerPopupViderDerniereCommandeHistorique();
		return;
	}
	// Suppression
	historique.shift();
	sauvegarderHistorique();
	afficherHistorique();
	// Fermer la popup
	fermerPopupViderDerniereCommandeHistorique();
}

// Vider l'historique
function confirmerSuppressionHistorique(){
	// Suppression
	localStorage.removeItem("historique");
	historique = [];
	afficherHistorique();
	// Fermer la popup
	fermerPopupViderHistorique();
}

// Création du récapitulatif des produits de l'historique
function calculerRecapitulatifProduitsHistorique(){
	const recapitulatif = {};
	
	for(let nom in objetProduits1){
		recapitulatif[nom] = 0;
	}
	
	for(let nom in objetProduits2){
		recapitulatif[nom] = 0;
	}
	
	historique.forEach(commande => {
		Object.entries(commande.produits).forEach(([nom, info]) => {
			recapitulatif[nom] += info.quantite;
		});
	});
	
	return recapitulatif;
}

/** Popups **/

// Ouverture du popup pour annuler le panier en cours
function ouvrirPopupViderCommande(){
	if (Object.keys(panier).length === 0){
		return;
	}
	document.getElementById("popup_vider_commande").style.display = "flex";
}

// Fermeture du popup pour annuler le panier en cours
function fermerPopupViderCommande(){
	document.getElementById("popup_vider_commande").style.display = "none";
}

// Ouverture du popup pour annuler la dernière commande de l'historique
function ouvrirPopupViderDerniereCommandeHistorique(){
	if(!historique || historique.length === 0){
		return;
	}
	document.getElementById("popup_vider_derniere_commande_historique").style.display = "flex";
}

// Fermeture du popup pour annuler la dernière commande de l'historique
function fermerPopupViderDerniereCommandeHistorique(){
	document.getElementById("popup_vider_derniere_commande_historique").style.display = "none";
}

// Ouverture du popup pour vider l'historique
function ouvrirPopupViderHistorique(){
	if(!historique || historique.length === 0){
		return;
	}
	document.getElementById("popup_vider_historique").style.display = "flex";
}

// Fermeture du popup pour vider l'historique
function fermerPopupViderHistorique(){
	document.getElementById("popup_vider_historique").style.display = "none";
}

/** CSV **/

// Exporter les commandes de l'historique
function exporterCommandesHistorique()
{
	// En-têtes CSV
	let csvContenu = "Commande;Montant;Heure;Détails\n";
	
	historique.forEach(commande => {
		const details = afficherDetailCommande(commande.produits);
		csvContenu += `${commande.id};${commande.total};${commande.temps};${details}\n`;
	});
	
	telechargerCSV("historique", csvContenu);
}

// Exporter le récapitulatif de l'historique
function exporterRecapitulatifHistorique()
{
	// En-têtes CSV
	let csvContenu = "Produit;Quantité totale;Prix Unitaire;Total\n";
	
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		csvContenu += `${nom};${quantite};;\n`;
	});
	
	// Création du fichier
	telechargerCSV("recapitulatif", csvContenu);
}

// Télécharger les fichiers CSV
function telechargerCSV(nomFichier, contenuFichier){
	const BOM = "\uFEFF";
	const blob = new Blob([BOM + contenuFichier], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement("a");
	a.href = url;
	a.download = nomFichier+".csv";
	a.click();
	
	URL.revokeObjectURL(url);
}

function telechargerEtEnvoyerRapports(){
	if(!historique || historique.length === 0){
		return;
	}
	
	exporterCommandesHistorique();
	exporterRecapitulatifHistorique();
	
	const destinataire = "apelbrou@gmail.com";
	const totalCumule = document.getElementById('totalCumule').textContent;
	const objet = encodeURIComponent(`Rapports de Caisse APEL - ${new Date().toLocaleDateString('fr-FR')}`);
	const corps = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint les récapitulatifs des ventes de la caisse APEL de (votre NOM et Prénom) :\n\n- Historique des commandes.\n- Récapitulatif des produits vendus (total encaissé : ${totalCumule} €).\n\nMerci de coller les fichiers CSV téléchargés en pièces jointes de ce mail.\n\nCordialement.`);
	const mailtoLink = `mailto:${destinataire}?subject=${objet}&body=${corps}`;
	setTimeout(() => {
		window.location.href = mailtoLink;
		alert("Les fichiers CSV ont été téléchargés. Veuillez les joindre manuellement à votre mail.");
	}, 500);
}

/** Gestion du mode jour/nuit **/

// Changer de mode jour ou nuit en fonction de l'état actuel
function changerModeJourNuit(){
	const body = document.body;
	const bouton = document.getElementById("bouton_mode_nuit");
	
	body.classList.toggle("mode_nuit");
	
	const isDark = body.classList.contains("mode_nuit");
	localStorage.setItem("modeNuit", isDark);
	
	if(isDark){
		bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode jour</span><span class="bouton_mode_nuit_icone">&#9728;</span>';
	}
	else{
		bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode nuit</span><span class="bouton_mode_nuit_icone">&#9789;</span>';
	}
}