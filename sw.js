const version_cache = "caisse-APEL-version-1.1.2";

const urls_pour_cache = [
	"https://c3dr4g0n.github.io/caisse_APEL/",
	"https://c3dr4g0n.github.io/caisse_APEL/index.html",
	"https://c3dr4g0n.github.io/caisse_APEL/caisse_alimentation.html",
	"https://c3dr4g0n.github.io/caisse_APEL/caisse_marche_de_noel.html",
	"https://c3dr4g0n.github.io/caisse_APEL/style.css",
	"https://c3dr4g0n.github.io/caisse_APEL/script.js",
	"https://c3dr4g0n.github.io/caisse_APEL/manifest.json",
	"https://c3dr4g0n.github.io/caisse_APEL/images/icone_192.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/icone_512.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/bijou.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/bonbon.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/bougie.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/cafe.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/carte_de_voeux.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/chaussettes.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/chocolat.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/chocolat_chaud.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/cookie.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/crepe_caramel.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/crepe_chocolat.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/crepe_sucre.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/cupcake.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/decoration.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/decoration_lumineuse.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/divers_1.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/divers_2.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/divers_3.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/divers_4.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/divers_5.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/gateau.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/guimauve.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/jacinthe.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/marionnette.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/mug.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/pate_de_fruits.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/plante_grasse.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/porte_cle.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/sable.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/stylo.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/the.png",
	"https://c3dr4g0n.github.io/caisse_APEL/images/vin_chaud.png"
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
							return caches.match("caisse_alimentation.html");
						}
						if(url.includes("caisse_marche_de_noel.html")){
							return caches.match("caisse_marche_de_noel.html");
						}
						return caches.match("index.html");
					}
					return;
				});
		})
	);
});
	
