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
const objetProduits2 = {
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
		date: new Date().toLocaleDateString('fr-FR'),
		heure: new Date().toLocaleTimeString('fr-FR')
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
		ligne.innerHTML = `<b>Commande #${commande.id}</b> — ${commande.total.toFixed(2)}€ — ${commande.heure} (${details})`;
		divHistorique.appendChild(ligne);
	});
	
	// Affichage du récapitulatif
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	let texte_recapitulatif = "<h4>Alimentation</h4>";
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		if(nom === Object.keys(objetProduits2)[0]){
			texte_recapitulatif += `<h4>Marché de Noël</h4>`;
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
	let csvContenu = "Commande;Montant;Heure;Détails\n";
	
	historique.forEach(commande => {
		const details = afficherDetailCommande(commande.produits);
		const chaine_total = commande.total.toString().replace('.', ',');
		csvContenu += `${commande.id};${chaine_total};${commande.date} ${commande.heure};${details}\n`;
	});
	
	return csvContenu;
}

// Exporter le récapitulatif de l'historique
function exporterRecapitulatifHistorique()
{
	let csvContenu = "Produit;Quantité totale;Prix Unitaire;Total\n";
	
	const recapitulatif = calculerRecapitulatifProduitsHistorique();
	let quantite_final = 0;
	let total_final = 0;
	
	Object.entries(recapitulatif).forEach(([nom, quantite]) => {
		let prix_unitaire = 0;
		if(objetProduits1[nom]){
			prix_unitaire = objetProduits1[nom].prix;
		}
		else if(objetProduits2[nom]){
			prix_unitaire = objetProduits2[nom].prix;
		}
		
		quantite_final += quantite;
		let total_article = quantite * prix_unitaire;
		total_final += total_article;
		
		const chaine_prix = prix_unitaire.toString().replace('.', ',');
		const chaine_total = total_article.toString().replace('.', ',');
		
		csvContenu += `${nom};${quantite};${chaine_prix};${chaine_total}\n`;
	});
	
	const chaine_total = total_final.toString().replace('.', ',');
	
	csvContenu += `TOTAL;${quantite_final};;${chaine_total}\n`;
	
	return csvContenu;
}

// Exporter les commandes et le récapitulatif de l'historique
function exporterRapport(){
	if(!historique || historique.length === 0){
		return;
	}
	
	const csvCommandes = exporterCommandesHistorique();
	const csvRecapitulatif = exporterRecapitulatifHistorique();
	
	const csvRapport = "*** Historique des commandes ***\n"+csvCommandes+"\n\n*** Récapitulatif des commandes ***\n"+csvRecapitulatif;
	
	telechargerCSV("rapport", csvRapport);
}