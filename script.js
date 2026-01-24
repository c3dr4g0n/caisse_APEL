// Mode nuit
document.addEventListener("DOMContentLoaded", () => {
	const bouton = document.getElementById("bouton_mode_nuit");
	const estModeNuit = localStorage.getItem("modeNuit") === "true";
	
	if(estModeNuit){
		document.body.classList.add("mode_nuit");
		if(bouton){
			bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode jour</span><span class="bouton_mode_nuit_icone">&#9728;</span>';
		}
	}else{
		document.body.classList.remove("mode_nuit");
		if(bouton){
			bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode nuit</span><span class="bouton_mode_nuit_icone">&#9789;</span>';
		}
	}
	
	if (typeof rafraichirStylePaiement === "function"){
        rafraichirStylePaiement();
    }
});

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
	
	if (typeof rafraichirStylePaiement === "function"){
        rafraichirStylePaiement();
    }
}

// Télécharger les fichiers CSV
function telechargerCSV(nomFichier, contenuFichier){
	const BOM = "\uFEFF";
	const blob = new Blob([BOM + contenuFichier], {type : "text/csv;charset=utf-8;"});
	const url = URL.createObjectURL(blob);
	
	const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '_');
	const heure = new Date().toLocaleTimeString('fr-FR').replace(/:/g, '_');
	
	const a = document.createElement("a");
	a.href = url;
	a.download = nomFichier+`_${date}_${heure}.csv`;
	a.click();
	
	URL.revokeObjectURL(url);
}

// Partager les fichiers CSV
async function partagerCSV(titreFichier, descriptifFichier, nomFichier, contenuFichier){
	const BOM = "\uFEFF";
	const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '_');
	const heure = new Date().toLocaleTimeString('fr-FR').replace(/:/g, '_');
	const nomFichierComplet = `${nomFichier}_${date}_${heure}.csv`;
	const blob = new Blob([BOM + contenuFichier], {type : 'text/csv;charset=utf-8;'});
	const fichier = new File([blob], nomFichierComplet, {type : 'text/csv'});
	
	if(navigator.canShare && navigator.canShare({files : [fichier]})){
		try{
			await navigator.share({
				files : [fichier],
				title : titreFichier,
				text : descriptifFichier
			});
		}catch(erreur){
			console.log("Erreur de partage :", erreur);
			telechargerCSV(nomFichier, contenuFichier);
		}
	}else{
		telechargerCSV(nomFichier, contenuFichier);
	}
}