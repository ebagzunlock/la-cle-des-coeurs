/* =========================================
   LA CLÉ DES CŒURS
   CHARGEMENT DU CATALOGUE LOCAL JSON
   Source unique : produits.json
   Aucun appel à l'ancienne boutique / WooCommerce.
   ========================================= */

"use strict";

window.produits = [];

window.produitsReady = fetch("produits.json?v=20261107-local", { cache: "no-store" })
  .then(function(reponse) {
    if (!reponse.ok) {
      throw new Error("Impossible de charger produits.json : HTTP " + reponse.status);
    }
    return reponse.json();
  })
  .then(function(donnees) {
    if (!donnees || !Array.isArray(donnees.products)) {
      throw new Error("Le fichier produits.json ne contient pas de tableau products valide.");
    }

    window.produits.splice(0, window.produits.length, ...donnees.products);
    window.dispatchEvent(new Event("produits:loaded"));
    return window.produits;
  })
  .catch(function(erreur) {
    console.error("Erreur de chargement du catalogue local :", erreur);
    window.dispatchEvent(new Event("produits:error"));
    throw erreur;
  });
