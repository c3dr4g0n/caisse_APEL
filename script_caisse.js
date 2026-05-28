/*** Création des variables et constantes ***/

// récupération de la page en cours
const chemin = window.location.pathname;
let operation = '';

if(chemin.includes('caisse_alimentation.html') || chemin.includes('caisse_marche_de_noel.html')){
	operation = 'marche_de_noel';
}
else if(chemin.includes('caisse_fete_de_saint_paul.html')){
	operation = 'fete_de_saint_paul';
}

// Le panier en cours
let panier = {};

// L'historique des commandes
let historique = JSON.parse('[]');
if(operation === 'marche_de_noel'){
	historique = JSON.parse(localStorage.getItem('historique_marche_de_noel') || '[]');
}
else if(operation === 'fete_de_saint_paul'){
	historique = JSON.parse(localStorage.getItem('historique_fete_de_saint_paul') || '[]');
}

// Les produits avec les prix
// Alimentaire
const produits_marche_de_Noel_alimentation = {
	"Café" : {
		prix : 2,
		image : "cafe.png"
	},
	"Chocolat chaud" : {
		prix : 2,
		image : "chocolat_chaud.png"
	},
	"Thé de Noël" : {
		prix : 2,
		image : "the.png"
	},
	"Vin chaud" : {
		prix : 3,
		image : "vin_chaud.png"
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
	"Guimauve" : {
		prix : 3.5,
		image : "guimauve.png"
	},
	"Pâte de fruits" : {
		prix : 3.5,
		image : "pate_de_fruits.png"
	},
	"Sablé" : {
		prix : 1.5,
		image : "sable.png"
	}
};

// Autre
const produits_marche_de_Noel_marche = {
	"Divers 1 €" : {
		prix : 1,
		image : "marche_de_noel_100.png"
	},
	"Divers 2 €" : {
		prix : 2,
		image : "marche_de_noel_200.png"
	},
	"Divers 3 €" : {
		prix : 3,
		image : "marche_de_noel_300.png"
	},
	"Divers 4 €" : {
		prix : 4,
		image : "marche_de_noel_400.png"
	},
	"Divers 5 €" : {
		prix : 5,
		image : "marche_de_noel_500.png"
	},
	"Divers 6 €" : {
		prix : 6,
		image : "marche_de_noel_600.png"
	}
};

// Fête de Saint Paul
const produits_fete_de_Saint_Paul = {
	"Café" : {
		prix : 2,
		image : "cafe.png"
	},
	"Eau" : {
		prix : 0.5,
		image : "eau.png"
	},
	"Soft" : {
		prix : 2,
		image : "soft.png"
	},
	"Bonbon" : {
		prix : 2,
		image : "bonbon.png"
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
	"Ticket enveloppe" : {
		prix : 2,
		image : "ticket_enveloppe.png"
	},
	"Ticket de jeux" : {
		prix : 2,
		image : "ticket_jeux.png"
	},
	"Ticket de jeux x12" : {
		prix : 20,
		image : "ticket_jeux.png"
	},
	"Ticket de jeux x25" : {
		prix : 40,
		image : "ticket_jeux.png"
	}
};

/*** Affichages dynamiques ***/

// Génération des boutons pour ajouter des produits au panier en cours
if(chemin.includes('caisse_alimentation.html')){
	genererBoutonsProduits(produits_marche_de_Noel_alimentation);
}
else if(chemin.includes('caisse_marche_de_noel.html')){
	genererBoutonsProduits(produits_marche_de_Noel_marche);
}
else if(chemin.includes('caisse_fete_de_saint_paul.html')){
	genererBoutonsProduits(produits_fete_de_Saint_Paul);
}

// Affichage de l'historique des commandes
afficherHistorique();

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
function genererBoutonsProduits(objet_produits){
	const div = document.getElementById('liste_produits');
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
	if(panier[nom]){
		panier[nom].quantite++;
		afficherPanier();
	}
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
	
	const moyen_de_paiement = document.querySelector('input[name="moyen_de_paiement"]:checked').value;
	
	const maintenant = new Date();
	const dateISO = maintenant.getFullYear() + "-" + (maintenant.getMonth() + 1).toString().padStart(2, '0') + "-" + maintenant.getDate().toString().padStart(2, '0');
	
	const commande = {
		id: historique.length + 1,
		produits: JSON.parse(JSON.stringify(panier)),
		total: parseFloat(document.getElementById('total').textContent),
		date: dateISO,
		heure: maintenant.toLocaleTimeString('fr-FR'),
		paiement: moyen_de_paiement
	};
	
	historique.unshift(commande);
	sauvegarderHistorique();
	afficherHistorique();
	
	document.querySelector('input[name="moyen_de_paiement"][value="Espèces"]').checked = true;
	rafraichirStylePaiement();
	
	panier = {};
	afficherPanier();
}

// Annuler le panier en cours
function confirmerSuppressionPanier(){
	// Suppression
	panier = {};
	afficherPanier();
	// Fermer la popup
	fermerPopupViderPanier();
}

// Calculer la monnaie à rendre
function calculerMonnaieAutomatiquement(){
	const total = parseFloat(document.getElementById("popup_rendre_monnaie_total").textContent);
	const donne = parseFloat(document.getElementById("popup_rendre_monnaie_montant_donne").value);
	const affichage = document.getElementById("popup_rendre_monnaie_montant_a_rendre");
	
	if(isNaN(donne)){
		affichage.textContent = "";
		return;
	}
	
	const rendu = donne - total;
	
	if(rendu < 0){
		affichage.textContent = `il manque ${Math.abs(rendu).toFixed(2)} €`;
		affichage.style.color = "red";
	}
	else{
		affichage.textContent = `${rendu.toFixed(2)} €`;
		affichage.style.color = "green";
	}
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
		ligne.innerHTML = `<b>Commande #${commande.id}</b> - ${commande.total.toFixed(2)}€ [${commande.paiement}] - ${commande.heure} (${details})`;
		divHistorique.appendChild(ligne);
	});
	
	// Affichage du récapitulatif
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	
	let texte_recapitulatif = "";
	if(operation === 'marche_de_noel'){
		texte_recapitulatif = "<h4>Alimentation</h4>";
	}
	
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		if((operation === 'marche_de_noel') && (nom === Object.keys(produits_marche_de_Noel_marche)[0])){
			texte_recapitulatif += `<h4>Marché de Noël</h4>`;
		}
		texte_recapitulatif += `${nom} : ${quantite}<br />`;
	});
	
	document.getElementById("recapitulatifProduits").innerHTML = texte_recapitulatif;
	document.getElementById("totalCumule").textContent = historique.reduce((somme, commande) => somme + commande.total, 0).toFixed(2);
	
	calculerTotauxParModeDePaiement();
}

// Sauvegarder l'historique
function sauvegarderHistorique(){
	if(operation === 'marche_de_noel'){
		localStorage.setItem('historique_marche_de_noel', JSON.stringify(historique));
	}
	else if(operation === 'fete_de_saint_paul'){
		localStorage.setItem('historique_fete_de_saint_paul', JSON.stringify(historique));
	}
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
	if(operation === 'marche_de_noel'){
		localStorage.removeItem('historique_marche_de_noel');
	}
	else if(operation === 'fete_de_saint_paul'){
		localStorage.removeItem('historique_fete_de_saint_paul');
	}
	historique = [];
	afficherHistorique();
	// Fermer la popup
	fermerPopupViderHistorique();
}

// Création du récapitulatif des produits de l'historique
function calculerRecapitulatifProduitsHistorique(){
	const recapitulatif = {};
	
	if(operation === 'marche_de_noel'){
		for(let nom in produits_marche_de_Noel_alimentation){
			recapitulatif[nom] = 0;
		}
		
		for(let nom in produits_marche_de_Noel_marche){
			recapitulatif[nom] = 0;
		}
	}
	else if(operation === 'fete_de_saint_paul'){
		for(let nom in produits_fete_de_Saint_Paul){
			recapitulatif[nom] = 0;
		}
	}
	
	historique.forEach(commande => {
		Object.entries(commande.produits).forEach(([nom, info]) => {
			recapitulatif[nom] += info.quantite;
		});
	});
	
	return recapitulatif;
}

/** Popups **/

// Ouverture du popup pour rendre la monnaie
function ouvrirPopupRendreMonnaie(){
	if (Object.keys(panier).length === 0){
		return;
	}
	document.getElementById("popup_rendre_monnaie_total").textContent = document.getElementById("total").textContent;
	document.getElementById("popup_rendre_monnaie").style.display = "flex";
	const input = document.getElementById("popup_rendre_monnaie_montant_donne");
	input.value = "";
	const affichage = document.getElementById("popup_rendre_monnaie_montant_a_rendre");
	affichage.textContent = "-";
	affichage.style.color = "black";
	input.addEventListener("input", calculerMonnaieAutomatiquement);
}

// Fermeture du popup pour rendre la monnaie
function fermerPopupRendreMonnaie(){
	document.getElementById("popup_rendre_monnaie").style.display = "none";
	const input = document.getElementById("popup_rendre_monnaie_montant_donne");
	input.removeEventListener("input", calculerMonnaieAutomatiquement);
}

// Ouverture du popup pour annuler le panier en cours
function ouvrirPopupViderPanier(){
	if (Object.keys(panier).length === 0){
		return;
	}
	document.getElementById("popup_vider_panier").style.display = "flex";
}

// Fermeture du popup pour annuler le panier en cours
function fermerPopupViderPanier(){
	document.getElementById("popup_vider_panier").style.display = "none";
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
	let csvContenu = "Commande;Montant;Paiement;Date;Heure;Détails\n";
	
	historique.forEach(commande => {
		const details = afficherDetailCommande(commande.produits);
		const chaine_total = commande.total.toString().replace('.', ',');
		csvContenu += `${commande.id};${chaine_total};${commande.paiement};${commande.date};${commande.heure};${details}\n`;
	});
	
	return csvContenu;
}

// Exporter le récapitulatif de l'historique
function exporterRecapitulatifHistorique()
{
	let csvContenu = "Produit;Prix Unitaire;Quantité totale;Total\n";
	
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	let quantite_final = 0;
	let total_final = 0;
	
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		let prix_unitaire = 0;
		if(produits_marche_de_Noel_alimentation[nom]){
			prix_unitaire = produits_marche_de_Noel_alimentation[nom].prix;
		}
		else if(produits_marche_de_Noel_marche[nom]){
			prix_unitaire = produits_marche_de_Noel_marche[nom].prix;
		}
		else if(produits_fete_de_Saint_Paul[nom]){
			prix_unitaire = produits_fete_de_Saint_Paul[nom].prix;
		}
		
		quantite_final += quantite;
		let total_article = quantite * prix_unitaire;
		total_final += total_article;
		
		const chaine_prix = prix_unitaire.toString().replace('.', ',');
		const chaine_total = total_article.toString().replace('.', ',');
		
		csvContenu += `${nom};${chaine_prix};${quantite};${chaine_total}\n`;
	});
	
	const chaine_total = total_final.toString().replace('.', ',');
	
	csvContenu += `TOTAL;;${quantite_final};${chaine_total}\n`;
	
	return csvContenu;
}

// Exporter le récapitulatif de l'historique
function exporterRecapitulatifModesDePaiement()
{
	let csvContenu = "Moyen de paiement;Total\n";
	
	let total_especes = 0;
	let total_cb = 0;
	let total_cheque = 0;
	
	historique.forEach(commande => {
		const totalCommande = parseFloat(commande.total);
		if(commande.paiement === "Espèces"){
			total_especes += totalCommande;
		}else if(commande.paiement === "CB"){
			total_cb += totalCommande;
		}else{
			total_cheque += totalCommande;
		}
	});
	
	const chaine_total_especes = total_especes.toString().replace('.', ',');
	const chaine_total_cb = total_cb.toString().replace('.', ',');
	const chaine_total_cheque = total_cheque.toString().replace('.', ',');
	
	csvContenu += `Espèces;${chaine_total_especes};;\n`;
	csvContenu += `CB;${chaine_total_cb};;\n`;
	csvContenu += `Chèque;${chaine_total_cheque};;\n`;
	
	return csvContenu;
}

// Exporter les commandes et le récapitulatif de l'historique
function exporterRapport(){
	if(!historique || historique.length === 0){
		return;
	}
	
	const csvRecapitulatifModesDePaiement = exporterRecapitulatifModesDePaiement();
	const csvRecapitulatif = exporterRecapitulatifHistorique();
	const csvCommandes = exporterCommandesHistorique();
	
	const csvRapport = "*** Paiements ***\n"+csvRecapitulatifModesDePaiement+"\n\n*** Récapitulatif des commandes ***\n"+csvRecapitulatif+"\n\n*** Historique des commandes ***\n"+csvCommandes;
	
	partagerCSV('Rapport de caisse APEL', 'Voici le rapport de la caisse (CSV).', 'rapport_'+operation, csvRapport);
}

// Fonction pour mettre à jour l'apparence des boutons de paiement
function rafraichirStylePaiement() {
    const labels = document.querySelectorAll('.paiement_selection label');
    labels.forEach(label => {
        const radio = label.querySelector('input');
        if(radio.checked){
			label.classList.add('actif');
        }else{
            label.classList.remove('actif');
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="moyen_de_paiement"]').forEach(input => {
        input.addEventListener('change', rafraichirStylePaiement);
    });
    rafraichirStylePaiement();
});

// Calcul des totaux en fonction du mode de règlement
function calculerTotauxParModeDePaiement(){
	let total_especes = 0;
	let total_cb = 0;
	let total_cheque = 0;
	
	historique.forEach(commande => {
		const totalCommande = parseFloat(commande.total);
		if(commande.paiement === "Espèces"){
			total_especes += totalCommande;
		}else if(commande.paiement === "CB"){
			total_cb += totalCommande;
		}else{
			total_cheque += totalCommande;
		}
	});
	
	// Mise à jour de l'affichage
	document.getElementById("total_especes").textContent = total_especes.toFixed(2) + " €";
	document.getElementById("total_cb").textContent = total_cb.toFixed(2) + " €";
	document.getElementById("total_cheque").textContent = total_cheque.toFixed(2) + " €";
}