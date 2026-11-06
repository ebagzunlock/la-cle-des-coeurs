"use strict";

// =============================================
// LA CLÉ DES CŒURS
// Catalogue : 76 accessoires et 2 montres
// Photos originales conservées
// Images génériques ajoutées automatiquement
// =============================================

const creerProduit = (id, nom, marque, prix, ancienPrix = null, categories = ["accessoires"], extra = {}) => ({
  id,
  nom,
  marque,
  categorie: categories.includes("homme") && !categories.includes("accessoires") ? "homme" : "accessoires",
  categories,
  prix,
  ancienPrix,
  devise: "EUR",
  image: "",
  actif: true,
  ...extra
});

const produits = [
  // PAGE 1
  {
    ...creerProduit("bague-cartier-trinite-diamants-54", "Bague Cartier Trinité – Or tricolore 18 carats – Diamants – Taille 54 UE / 6,75 US – Avec boîte", "Cartier", 2500, 3200),
    image: "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/AA1.webp"
  },
  {
    ...creerProduit("bague-cartier-trinity-diamants-4-1-4", "Bague Cartier Trinity en or 18 carats et diamants – Taille 4 1/4 – Excellent état", "Cartier", 4599, 6000),
    image: "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/AB1-430x323.webp"
  },
  {
    ...creerProduit("bague-fiancailles-cartier-1895", "Bague de fiançailles Cartier 1895 en or jaune 18 carats, diamant rond de 0,72 ct, couleur D, pureté VS1", "Cartier", 1899),
    image: "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/AC1-1-430x350.webp"
  },
  {
    ...creerProduit("bracelet-alhambra-cornaline-1", "Bracelet Alhambra en or rose 18 carats et cornaline de VanCleef & Arpels, avec boite et certificat.", "Van Cleef & Arpels", 3299),
    image: "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CC4-430x368.jpeg"
  },
  creerProduit("bracelet-alhambra-cornaline-2", "Bracelet Alhambra en or rose 18 carats et cornaline de VanCleef & Arpels, avec boite et certificat.", "Van Cleef & Arpels", 3299),
  creerProduit("bracelet-cartier-love-authentique", "Bracelet authentique CARTIER Love", "Cartier", 5500),
  creerProduit("bracelet-cartier-love-jaune-16", "Bracelet CARTIER « LOVE » en or jaune 18 carats 750 taille 16", "Cartier", 3599),
  creerProduit("bracelet-cartier-juste-un-clou-2025", "Bracelet Cartier Juste Un Clou 18K Or Jaune 18 cm – Bijou de Luxe Authentique 2025", "Cartier", 2000),
  creerProduit("bracelet-cartier-juste-un-clou-36mm", "Bracelet Cartier JUSTE UN CLOU en or jaune 18 carats de 3,6 mm, taille 17, boîte cadeau, reçu", "Cartier", 4300),
  creerProduit("bracelet-cartier-juste-un-clou-small-15", "Bracelet Cartier Juste Un Clou Small Or 18K 15 cm – Bijou de Luxe Authentique", "Cartier", 2300),
  creerProduit("bracelet-cartier-love-blanc-15", "Bracelet Cartier Love – Or blanc 18 carats – Taille 15", "Cartier", 2299, 3000),
  creerProduit("bracelet-cartier-love-jaune-petit-17", "Bracelet Cartier Love – Or Jaune 18 ct – Petit Modèle Taille 17 – Occasion Authentique", "Cartier", 3700),

  // PAGE 2
  creerProduit("bracelet-cartier-love-rose-16-complet", "Bracelet Cartier Love – Or rose 18 carats – Taille 16 – Ensemble complet avec papiers", "Cartier", 3799, 4500),
  creerProduit("bracelet-cartier-love-16-rose", "Bracelet Cartier Love 16 Or Rose – Ensemble Complet | Excellent État", "Cartier", 3900),
  creerProduit("bracelet-cartier-love-blanc-17-certificat", "Bracelet Cartier Love authentique en or blanc 18 carats, taille 17, avec certificat.", "Cartier", 3500),
  creerProduit("bracelet-cartier-love-jaune-17-complet", "Bracelet Cartier Love Authentique Or Jaune 18K – Taille 17 cm – Boîte et Papiers", "Cartier", 4500),
  creerProduit("bracelet-cartier-love-4-diamants-blanc-17", "Bracelet Cartier Love Classique – 4 Diamants – Or blanc 18 carats – Taille 17", "Cartier", 4299, 5500),
  creerProduit("bracelet-cartier-love-rose-21", "Bracelet Cartier Love Classique – Or Rose 18 Carats – 21 cm – Occasion 2022 avec Coffret et Certificat", "Cartier", 2500),
  creerProduit("bracelet-cartier-love-blanc-17-complet", "Bracelet Cartier LOVE en or blanc 18 carats, taille 17, coffret complet et certificat", "Cartier", 3699, 4500),
  creerProduit("bracelet-cartier-love-jaune-16-page2", "Bracelet Cartier Love en Or jaune 18 carats – Taille 16", "Cartier", 4099),
  creerProduit("bracelet-cartier-love-jaune-15-a", "Bracelet Cartier Love en or jaune 18 carats taille 15.", "Cartier", 4099),
  creerProduit("bracelet-cartier-love-jaune-15-b", "Bracelet Cartier Love en or jaune 18 carats, taille 15", "Cartier", 4200),
  creerProduit("bracelet-cartier-love-jaune-18-fermoir", "Bracelet Cartier Love en or jaune 18 carats, taille 18, fermoir à vis, neuf, avec boîte et papier", "Cartier", 3299, 4000),
  creerProduit("bracelet-cartier-love-jaune-tournevis-19", "Bracelet Cartier Love en or jaune avec tournevis, taille 19", "Cartier", 3500),

  // PAGE 3
  creerProduit("bracelet-cartier-love-rose-6-diamants-19", "Bracelet Cartier Love en or rose 18 carats, 6 diamants, taille 19", "Cartier", 3900),
  creerProduit("bracelet-cartier-love-rose-17-complet", "Bracelet Cartier Love en or rose 18 carats, taille 17, ensemble complet", "Cartier", 4599),
  creerProduit("bracelet-cartier-love-moyen-16", "Bracelet Cartier Love modèle moyen taille 16 boîte et papiers", "Cartier", 4300),
  creerProduit("bracelet-cartier-love-blanc-19", "Bracelet Cartier Love Or Blanc 18K 6,1 mm – Taille 19 – Authentique avec Boîte et Papiers", "Cartier", 4300),
  creerProduit("bracelet-cartier-love-blanc-4-diamants", "Bracelet Cartier Love Or Blanc 18K Classique – 4 Diamants – Boîte et Papiers", "Cartier", 4800),
  creerProduit("bracelet-cartier-love-jaune-17", "Bracelet Cartier Love Or Jaune 18K – Taille 17 cm – Authentique avec Boîte et Papiers", "Cartier", 4300),
  creerProduit("bracelet-cartier-love-jaune-18", "Bracelet Cartier Love Or Jaune 18K Authentique – Taille 18 – Jonc Homme/Femme", "Cartier", 3500),
  creerProduit("bracelet-cartier-love-rose-16-complet-page3", "Bracelet Cartier Love Or Rose 18K – Taille 16 – Ensemble Complet, Excellent État", "Cartier", 3800),
  creerProduit("bracelet-cartier-love-jaune-2023", "Bracelet Cartier Love Taille Classique – Or Jaune 18k, avec Boîte & Certifiacat (2023)", "Cartier", 3699),
  creerProduit("bracelet-cartier-love-jaune-2024-19", "Bracelet Cartier Love, taille 19 (modèle 2024), ensemble complet, or jaune.", "Cartier", 3700),
  creerProduit("bracelet-cartier-panthere-3-rangs", "Bracelet Cartier Panthère – 3 rangs – Or jaune 18 carats – Très bon état", "Cartier", 3099, 4500),
  creerProduit("bracelet-fred-emeraude", "Bracelet Fred en or jaune 18 carats avec émeraude", "Fred", 6800),

  // PAGE 4
  creerProduit("bracelet-fred-force-10-cable-vert", "Bracelet Fred Force 10 en or jaune 18 carats avec câble vert émeraude – Grand modèle 19", "Fred", 7850),
  creerProduit("bracelet-fred-force-10-rose-ceramique", "Bracelet Fred Force 10 en or rose 18 carats, céramique, diamants et câble noir – Grand modèle 16", "Fred", 5099),
  creerProduit("bracelet-fred-force-10-rose-diamant", "Bracelet Fred Force 10 grand modèle en or rose 18 carats et diamant", "Fred", 2888),
  creerProduit("bracelet-jonc-cartier-trinity", "Bracelet jonc Cartier Trinity Tricolore en or 18 carats – Modèle classique", "Cartier", 2850, 4000),
  creerProduit("bracelet-jonc-tiffany-notes", "Bracelet jonc Tiffany & Co. Notes en or jaune 18 carats – 28,10 g", "Tiffany & Co.", 3099),
  creerProduit("bracelet-jonc-cartier-love-blanc-18", "Bracelet jonc vissé Cartier Love en or blanc 18 carats – Taille 18", "Cartier", 3099, 3700),
  creerProduit("bracelet-love-cartier-blanc-16", "Bracelet Love Cartier – Or blanc 18 carats – Taille 16 – Coffret et tournevis", "Cartier", 3599, 4500),
  creerProduit("bracelet-love-cartier-rose-19", "Bracelet Love Cartier authentique, modèle classique, 4 diamants, or rose, taille 19.", "Cartier", 6200),
  creerProduit("bracelet-love-cartier-jaune-b4034", "Bracelet Love Cartier en or jaune 18 carats, taille 16, avec boîte et certificat – B4034", "Cartier", 3599, 4500),
  creerProduit("bracelet-love-cartier-jaune-18", "Bracelet Love Cartier en or jaune 18 K, modèle classique – Taille 18.", "Cartier", 4099),
  creerProduit("bracelet-love-cartier-rose-17", "Bracelet love cartier en or rose taille 17", "Cartier", 3250),
  creerProduit("bracelet-manchette-cartier-love-blanc", "Bracelet Manchette Cartier Love Grand Modèle – Or Blanc 18K – Boîte et Papiers", "Cartier", 4250),

  // PAGE 5
  creerProduit("bracelet-manchette-cartier-love-jaune-20", "Bracelet Manchette Cartier Love Or Jaune 18K Taille 20 – Authentique avec Boîte et Papiers", "Cartier", 2700),
  creerProduit("bracelet-manchette-cartier-panthere-1987", "Bracelet Manchette Cartier Panthère Femme 1987 – Or Jaune 18 Carats", "Cartier", 7400),
  creerProduit("royal-pop-blaue-acht", "Bracelet Royal Pop Blaue Acht – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-green-eight", "Bracelet Royal Pop Green Eight – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-huit-blanc", "Bracelet Royal Pop Huit Blanc – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-lan-ba", "Bracelet Royal Pop Lan Ba – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-ocho-negro", "Bracelet Royal Pop Ocho Negro – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-orenji-hachi", "Bracelet Royal Pop Orenji Hachi – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-otg-roz", "Bracelet Royal Pop Otg Roz – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("royal-pop-otto-rosso", "Bracelet Royal Pop Otto Rosso – Bioceramic Swiss Made", "AP x Swatch", 53, null, ["accessoires", "ap-swatch"]),
  creerProduit("bracelet-vca-malachite-5-motifs", "Bracelet Van Cleef & Arpels 5 Motifs Malachite en Or Jaune 18k – Avec Boîte & Certificat", "Van Cleef & Arpels", 2500),
  creerProduit("bracelet-vca-alhambra-onyx-vintage", "Bracelet Van Cleef & Arpels Alhambra 5 Motifs – Or 18K et Onyx – Vintage", "Van Cleef & Arpels", 3000),

  // PAGE 6
  creerProduit("bracelet-vca-vintage-alhambra-onyx", "Bracelet Van Cleef & Arpels Vintage Alhambra – 5 motifs en or jaune 18 carats et onyx", "Van Cleef & Arpels", 2999, 4000),
  creerProduit("bracelet-vca-alhambra-nacre-19", "Bracelet Van Cleef & Arpels Vintage Alhambra 5 motifs en nacre blanche, or jaune 18 carats, taille 19 cm", "Van Cleef & Arpels", 2099, 3000),
  creerProduit("bracelet-vca-alhambra-cornaline", "Bracelet Vintage Alhambra en or jaune 18 carats et cornaline à 5 motifs – Van Cleef & Arpels", "Van Cleef & Arpels", 2099, 3200),
  creerProduit("bracelet-cartier-love-18-2024", "Bracelet/bracelet Cartier Love taille 18 – petit modèle 2024 ensemble complet or jaune", "Cartier", 3600),
  creerProduit("cartier-juste-un-clou-petit-16", "Cartier Juste un Clou – Bracelet petit modèle en or jaune 18 carats, taille 16, avec écrin et certificat", "Cartier", 2015),
  creerProduit("cartier-juste-un-clou-bague-52", "Cartier Juste Un Clou Bague en or rose 18 carats Taille 52 / US 6", "Cartier", 1850),
  creerProduit("cartier-juste-un-clou-diamant-rose", "Cartier Juste Un Clou Diamant Or Rose Bracelet", "Cartier", 5500),
  creerProduit("cartier-juste-un-clou-ring-jaune-49", "Cartier Juste Un Clou Ring 49mm US 5 18K Jaune Modèle Classique", "Cartier", 2500),
  creerProduit("cartier-love-bracelet-jaune-18-2020", "Cartier Love Bracelet – Taille 18, or jaune 18 carats, collection Love (2020)", "Cartier", 3269),
  creerProduit("cartier-tank-homme-wsta0056", "Cartier Tank Homme – Acier inoxydable – Cadran vert – 25 mm – Quartz – WSTA0056", "Cartier", 2000, 3000, ["accessoires", "homme"], { reference: "WSTA0056" }),
  creerProduit("collier-vca-magic-alhambra", "Collier long motif Magic Alhambra 1 de Van Cleef & Arpels en or blanc et diamants", "Van Cleef & Arpels", 13750, 16500),
  creerProduit("pendentifs-vintage-alhambra-diamants", "Ensemble Complet de Pendentifs Vintage Alhambra en Or Jaune 18 carats et Diamants – Van Cleef & Arpels", "Van Cleef & Arpels", 1600, 2700),

  // PAGE 7
  creerProduit("bracelet-fred-chaine-infini-rose", "Grand bracelet Fred Chaîne Infini en or rose 18 carats", "Fred", 3099),
  creerProduit("bracelet-fred-forsten-blanc-15", "Grand bracelet Fred Forsten en or blanc 18 carats – Taille 15", "Fred", 2555),
  creerProduit("pendentif-vca-pure-alhambra-onyx", "Pendentif Pure Alhambra en Onyx et Or Jaune 18 carats – Van Cleef & Arpels", "Van Cleef & Arpels", 3835, 4610),
  creerProduit("bracelet-vca-vintage-alhambra-malachite", "Van Cleef & Arpels Vintage Alhambra – Bracelet 5 motifs en or jaune 18k et malachite", "Van Cleef & Arpels", 3099, 4500),

  // MONTRES CARTIER
  creerProduit("cartier-santos-carree-2961", "Cartier Santos Carrée 2961 – Cadran Bordeaux", "Cartier", 4300, 5100, ["homme"], {
    reference: "2961",
    description: "Montre Cartier Santos Carrée de 1982 avec cadran bordeaux Swiss Only, boîte et papiers d’origine.",
    ficheSource: "https://bijouterielamalmaison.fr/product/cartier-santos-carree-2961-cadran-bordeaux-swiss-only-1982-boite-papiers-rare/"
  }),
  creerProduit("cartier-santos-wssa0062", "Cartier Santos de Cartier WSSA0062 – Cadran vert", "Cartier", 6000, null, ["homme"], {
    reference: "WSSA0062",
    description: "Montre automatique Cartier Santos en acier, cadran vert, boîte et papiers.",
    ficheSource: "https://bijouterielamalmaison.fr/product/cartier-santos-de-cartierwssa0062-ensemble-complet-garantie/"
  })
];

// =============================================
// IMAGES DE REMPLACEMENT AUTOMATIQUES
// Les images déjà renseignées ne sont jamais écrasées.
// =============================================

const imagesBijoux = [
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=85"
];

const imagesMontres = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85",
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&q=85"
];

const imagesBracelets = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=85"
];

const imagesBagues = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=85"
];

const imagesColliers = [
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=85",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=85"
];

produits.forEach((produit, index) => {
  // Conserver toute image déjà présente.
  if (produit.image && produit.image.trim() !== "") {
    return;
  }

  const texte = [
    produit.nom || "",
    produit.marque || "",
    produit.categorie || "",
    ...(produit.categories || [])
  ].join(" ").toLowerCase();

  let collection = imagesBracelets;

  if (texte.includes("montre") || texte.includes("watch")) {
    collection = imagesMontres;
  } else if (texte.includes("bague") || texte.includes("ring")) {
    collection = imagesBagues;
  } else if (texte.includes("collier") || texte.includes("pendentif")) {
    collection = imagesColliers;
  } else if (texte.includes("royal pop") || texte.includes("swatch")) {
    collection = imagesMontres;
  } else if (texte.includes("bracelet")) {
    collection = imagesBracelets;
  } else {
    collection = imagesBijoux;
  }

  produit.image = collection[index % collection.length];
});

// =============================================
// EXPORT DU CATALOGUE
// =============================================

if (typeof window !== "undefined") {
  window.produits = produits;
}

console.log("LA CLÉ DES CŒURS : " + produits.length + " produits chargés.");
