// Mode nuit
document.addEventListener("DOMContentLoaded", () => {
    const bouton = document.getElementById("bouton_mode_nuit");
    if (!bouton) return;

    if (localStorage.getItem("modeNuit") === "true") {
        bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode jour</span><span class="bouton_mode_nuit_icone">&#9728;</span>';
        document.body.classList.add("mode_nuit");
    } else {
        bouton.innerHTML = '<span class="bouton_mode_nuit_texte">Mode nuit</span><span class="bouton_mode_nuit_icone">&#9789;</span>';
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
}

// Télécharger les fichiers CSV
function telechargerCSV(nomFichier, contenuFichier){
	const BOM = "\uFEFF";
	const blob = new Blob([BOM + contenuFichier], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	
	date = new Date().toLocaleDateString('fr-FR'),
	heure = new Date().toLocaleTimeString('fr-FR')
	
	const a = document.createElement("a");
	a.href = url;
	a.download = nomFichier+`_${date}_${heure}.csv`;
	a.click();
	
	URL.revokeObjectURL(url);
}