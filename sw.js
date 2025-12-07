const version_cache = "caisse-APEL-version-1.1.5";

const urls_pour_cache = [
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
	"./images/marionnette.png",
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
		caches.open(version_cache).then(cache => cache.addAll(urls_pour_cache))
	);
});

self.addEventListener("activate", evenement => {
	evenement.waitUntil(
		caches.keys().then(
			cles =>
				Promise.all(
					cles.map(cle => {
						if(cle !== version_cache){
							return caches.delete(cle);
						}
					})
				)
		);
	);
});

self.addEventListener("fetch", evenement => {
	if(evenement.request.url.startsWith("chrome-extension")){
		return;
	}
	
	evenement.respondWith(
		caches.match(evenement.request).then(cache_reponse => {
			if(cache_reponse){
				return cache_reponse;
			}
			return fetch(evenement.request)
				.then(reseau_reponse => caches.open(version_cache).then(cache => {
						cache.put(evenement.request, reseau_reponse.clone());
						return reseau_reponse;
				}))
				.catch(() => {
					if(evenement.request.mode === 'navigate'){
						const url = evenement.request.url;
						if(url.includes("caisse_alimentation.html")){
							return caches.match("./caisse_alimentation.html");
						}
						if(url.includes("caisse_marche_de_noel.html")){
							return caches.match("./caisse_marche_de_noel.html");
						}
						return caches.match("./index.html");
					}
				});
		})
	);
});