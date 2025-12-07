const version_cache = "caisse-APEL-version-1.0.1";

// 🧩 Liste toutes tes pages + CSS + JS + IMAGES ici :
const urls_pour_cache = [
	// Fichiers
	"./",
	"./index.html",
	"./caisse_alimentation.html",
	"./caisse_marche_de_noel.html",
	"./style.css",
	"./script.js",
	"./manifest.json",
	"./images/icone_192.png",
	"./images/icone_512.png",
	"./images/bijou.png",
	"./images/bonbon.png",
	"./images/bougie.png",
	"./images/cafe.png",
	"./images/carte_de_voeux.png",
	"./images/chaussettes.png",
	"./images/chocolat.png",
	"./images/chocolat_chaud.png",
	"./images/cookie.png",
	"./images/crepe_caramel.png",
	"./images/crepe_chocolat.png",
	"./images/crepe_sucre.png",
	"./images/cupcake.png",
	"./images/decoration.png",
	"./images/decoration_lumineuse.png",
	"./images/divers_1.png",
	"./images/divers_2.png",
	"./images/divers_3.png",
	"./images/divers_4.png",
	"./images/divers_5.png",
	"./images/gateau.png",
	"./images/guimauve.png",
	"./images/jacinthe.png",
	"./images/marionette.png",
	"./images/mug.png",
	"./images/pate_de_fruits.png",
	"./images/plante_grasse.png",
	"./images/porte_cle.png",
	"./images/sable.png",
	"./images/stylo.png",
	"./images/the.png",
	"./images/vin_chaud.png"
];

self.addEventListener("install", evenement => {
	evenement.waitUntil(
		caches.open(version_cache).then(cache => {
			cache.addAll(urls_pour_cache);
		})
	);
});

self.addEventListener("activate", evenement => {
	const version_cache_temporaire = [version_cache];
	evenement.waitUntil(
		caches.keys().then(
			cles =>
				Promise.all(
					cles.map(cle => !version_cache_temporaire.includes(cle)){
						return caches.delete(cle);
					}
				)
		)
	);
});

self.addEventListener("fetch", evenement => {
	evenement.respondWith(
		caches.match(evenement.request).then(
			cache_reponse => {
				return(cache_reponse || fetch(evenement.request).catch(() => {
					return caches.match("index.html");
				});
			}
		)
	);
});
	
