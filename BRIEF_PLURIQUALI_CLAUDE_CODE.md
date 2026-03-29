# Brief technique — Appli Pluri'Quali (PWA mobile)

> **Ce document est destiné à Claude Code.** Il contient toutes les spécifications pour créer l'application Pluri'Quali dans le dossier `/pluriquali/` du repo `enquete-plurielles`.

---

## 1. CONTEXTE

Pluri'Quali est un outil de **contrôle qualité terrain** utilisé par les Responsables Clients (RC) de l'Agence Pluri'Elles (société de facility management / services généraux, ~140 ETP, 60 sites en Île-de-France).

Les RC se déplacent sur les sites clients pour évaluer la qualité des prestations des agents opérationnels (hôtesses d'accueil, agents courrier, factotums, etc.). Ils remplissent une grille de critères, prennent des photos, rédigent un plan d'actions, puis génèrent un rapport.

**L'appli doit fonctionner comme une PWA installable sur smartphone (Android + iOS).**

---

## 2. EMPLACEMENT DANS LE REPO

- **Repo GitHub** : `https://github.com/Alexd8686/enquete-plurielles`
- **Dossier** : `/pluriquali/`
- **URL finale** : `https://alexd8686.github.io/enquete-plurielles/pluriquali/`
- **⚠️ NE PAS TOUCHER** aux fichiers existants :
  - `/index.html` (enquête de satisfaction)
  - `/chatbot/` (Pluri'IA chatbot)

---

## 3. UTILISATEURS

| Rôle | Utilisateurs | Accès |
|------|-------------|-------|
| Responsable Client (RC) | Boucif Benrabah, Diaba Sissoko, Sabrina Lacombe, Dominique Picoche | Contrôles terrain |
| Direction | Annie Roussey (DG), Alexandre Maury (DG Développement) | Contrôles + supervision |

**Authentification** : formulaire simple nom + email (pas de mot de passe, pas de Supabase). Le nom et l'email sont sauvegardés en localStorage pour pré-remplir la prochaine visite.

---

## 4. CHARTE GRAPHIQUE

Respecter strictement cette charte :

| Variable | Valeur | Usage |
|----------|--------|-------|
| Violet principal | `#6247AA` | Boutons, accents, headers |
| Violet foncé | `#4E3888` | Hover states |
| Violet clair | `#7B68C4` | Éléments secondaires |
| Foggy (violet pastel) | `#CEC2F0` | Texte sur fond sombre |
| Silver | `#ECEBF5` | Fonds de section |
| Noir | `#0D0B11` | Navbar, textes forts |
| Background | `#F6F4FB` | Fond de page |
| Texte | `#2D2A33` | Corps de texte |
| Muted | `#8A8494` | Texte secondaire |
| Border | `#DDD8E8` | Bordures |
| Vert (Conforme) | `#1B8A5A` | fond `#D4EFDF` |
| Orange (À améliorer) | `#C67D20` | fond `#FCF0DB` |
| Rouge (Non conforme) | `#A93246` | fond `#FADEE4` |
| Gris (N/A) | `#B0ADB8` | fond `#F2F1F4` |

**Typographies** :
- Titres : **Playfair Display** (600, 700, 800, 900)
- Corps : **DM Sans** (400, 500, 600, 700, 800)
- Source : Google Fonts

**Style général** : élégant, professionnel, mobile-first, coins arrondis (border-radius 8-16px), ombres subtiles.

---

## 5. ÉCRANS ET FONCTIONNALITÉS

### 5.1 Écran de connexion

- Logo "Pluri'Quali" en Playfair Display
- Sous-titre : "Contrôle qualité terrain — Responsables Clients Pluri'Elles"
- Champ **Nom** (placeholder : "Ex : Boucif Benrabah")
- Champ **Email** (placeholder : "prenom.nom@agence-plurielles.fr")
- Bouton "Accéder aux contrôles" (violet)
- Validation : les deux champs obligatoires, email doit contenir @
- Sauvegarde nom/email en localStorage pour pré-remplissage

### 5.2 Écran principal — Formulaire de contrôle

#### 5.2.1 Barre de navigation
- Fond noir (`#0D0B11`), sticky top
- Logo "Pluri'Quali" en Playfair Display couleur foggy
- Pastille verte à côté du logo (indicateur connecté)
- Lien "← Portail" à droite (retour vers `../index.html`)

#### 5.2.2 Barre de progression
- Fine barre (3px) sous la navbar
- Fond léger, remplissage dégradé violet → vert
- Progression = nombre de critères remplis / total des critères

#### 5.2.3 Section "Identification du site" (toujours ouverte par défaut)

| Champ | Type | Options / Placeholder |
|-------|------|----------------------|
| Client / Site | texte libre | "Ex : Gecina — Tour Pacific" |
| Date | date picker | Auto-rempli avec la date du jour |
| Type de contrôle | select | Visite hebdomadaire, Contrôle contradictoire, Contrôle mystère, Audit qualité annuel |
| Métier | select | Accueil / Hôte(sse), Agent Courrier, Factotum / Agent polyvalent, Hospitality Manager, Agent Property Manager, Agent Numérisation, Agent Reprographie |
| Ressource | texte libre | "Nom du salarié(e)" |

#### 5.2.4 Sections de contrôle qualité (accordéons pliables)

Chaque section est un accordéon avec : icône colorée + tag, titre, badge "X/Y" (nombre de critères remplis).

**Section 1 — Présentation & Tenue** (tag: PT, couleur violet `#6247AA`)
- Tenue conforme aux standards
- Chaussures adaptées et propres
- Badge visible et en bon état
- Hygiène et présentation
- Posture professionnelle

**Section 2 — Comportement & Sens du service** (tag: CS, couleur vert `#1B8A5A`)
- Accueil chaleureux
- Proactivité et anticipation
- Gestion des demandes
- Politesse et courtoisie
- Pas de téléphone personnel
- Esprit d'équipe

**Section 3 — Connaissances & Formation** (tag: CF, couleur bleu `#2980B9`)
- Procédures du site
- Maîtrise des outils
- Consignes de sécurité
- Quizz de formation
- Cahier de consignes

**Section 4 — Qualité des prestations** (tag: QP, couleur orange `#C67D20`)
- Respect des horaires
- Qualité d'exécution
- Propreté du poste
- Gestion des flux
- Reporting à jour

**Section 5 — Valeur ajoutée** (tag: VA, couleur rouge `#A93246`)
- Propositions d'amélioration
- Initiative positive
- Satisfaction client
- Implication sur site

**Pour chaque critère** : 4 boutons de notation sur une ligne :
- **Conforme** → vert (border + fond vert clair)
- **À améliorer** → orange
- **Non conforme** → rouge
- **N/A** → gris

Un seul choix possible par critère. Clic sur un bouton = sélectionné visuellement.

**Sous chaque section** : zone de commentaire (textarea) avec bouton de dictée vocale (micro, Web Speech API `fr-FR`). Le bouton micro pulse en rouge pendant l'enregistrement.

#### 5.2.5 Section "Photos"
- Bouton "Prendre ou ajouter des photos" (style dashed border)
- Utilise `<input type="file" accept="image/*" capture="environment" multiple>`
- Prévisualisation en grille (miniatures 60x60px)
- Les photos sont converties en base64 via FileReader

#### 5.2.6 Section "Plan d'actions"
- Textarea pour les recommandations
- Bouton dictée vocale intégré

#### 5.2.7 Zone de validation
- Aperçu en temps réel : chips colorées montrant le décompte (ex: "15 Conformes", "3 À améliorer", "1 Non conforme")
- Bouton "Valider et générer le rapport" (violet)

### 5.3 Logique de scoring

```
Score = (nombre de "Conforme") / (nombre de "Conforme" + "À améliorer" + "Non conforme") × 100
```

- Les "N/A" ne comptent pas dans le calcul
- Minimum 5 critères remplis pour valider
- Le champ Client/Site est obligatoire

**Niveaux** :
- ≥ 80% → "Excellent" (couleur verte)
- ≥ 60% → "Satisfaisant" (couleur orange)
- ≥ 40% → "À améliorer" (couleur orange foncé)
- < 40% → "Insuffisant" (couleur rouge)

### 5.4 Génération du rapport

À la validation :

1. **Génération d'un fichier HTML** téléchargeable contenant :
   - Header noir avec logo Pluri'Quali
   - Nom du client, type de contrôle, date
   - Grille métadonnées (contrôleur, ressource, métier, type)
   - Score en grand (%) avec niveau et couleur
   - Décompte par statut (chips)
   - Détail section par section : chaque critère avec son statut coloré
   - Commentaires par section (si remplis)
   - Photos (si ajoutées, en base64 inline)
   - Plan d'actions (si rempli)
   - Footer : "Pluri'Quali — Agence Pluri'Elles — agence-plurielles.tech"

2. **Ouverture automatique du client mail** (mailto:) avec :
   - Destinataire = email du RC connecté
   - Sujet : `[Pluri'Quali] {type} - {client} - {date} (Score: {score}%)`
   - Corps pré-rempli avec récapitulatif
   - Instruction pour le RC : joindre le fichier HTML téléchargé en PJ

---

## 6. FONCTIONNALITÉ ADDITIONNELLE — HISTORIQUE DES CONTRÔLES

Ajouter un système d'historique en **localStorage** :

- À chaque validation, sauvegarder un résumé : `{ date, client, type, metier, agent, score, level, timestamp }`
- Écran "Historique" accessible via un bouton/onglet dans la navbar ou en bas de page
- Affichage en liste chronologique inversée (plus récent en haut)
- Chaque entrée montre : date, client, score (avec couleur), type
- Option de suppression individuelle
- Bouton "Exporter l'historique" (CSV)

---

## 7. PWA — Configuration

L'appli doit être installable comme une PWA :

### manifest.json
```json
{
  "name": "Pluri'Quali",
  "short_name": "PluriQuali",
  "description": "Contrôle qualité terrain — Agence Pluri'Elles",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#F6F4FB",
  "theme_color": "#6247AA",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (sw.js)
- Cache les fichiers statiques pour un usage offline (HTML, CSS, fonts)
- Stratégie cache-first pour les assets, network-first pour les données

### Icônes
- Générer des icônes PWA (192x192 et 512x512) avec le logo "PQ" sur fond violet `#6247AA`, texte blanc, style Playfair Display bold
- Ajouter les meta tags Apple (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.)

---

## 8. STRUCTURE DE FICHIERS ATTENDUE

```
pluriquali/
├── index.html          ← App principale (tout le CSS/JS peut être inline ou séparé)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
├── icon-192.png        ← Icône PWA 192x192
└── icon-512.png        ← Icône PWA 512x512
```

---

## 9. CONTRAINTES TECHNIQUES

- **Tout en statique** : HTML + CSS + JS vanilla. Pas de React, pas de framework, pas de backend.
- **Hébergé sur GitHub Pages** : pas de server-side.
- **Mobile-first** : optimisé pour smartphones (touch, scroll fluide, gros boutons)
- **Responsive** : sur petit écran (< 420px), les 4 boutons de notation passent en grille 2×2
- **Offline-capable** : le formulaire doit fonctionner sans connexion (seule la dictée vocale et le mailto nécessitent une connexion)
- **Pas de dépendance Supabase** : contrairement à la version actuelle, ne PAS inclure Supabase auth. L'authentification est un simple formulaire nom/email.
- **Web Speech API** pour la dictée vocale (`SpeechRecognition`, lang `fr-FR`, `continuous: false`, `interimResults: false`)

---

## 10. CE QUE TU NE DOIS PAS FAIRE

- ❌ Ne pas toucher à `/index.html` ni à `/chatbot/`
- ❌ Ne pas ajouter Supabase, Firebase ou tout backend
- ❌ Ne pas utiliser React, Vue, Angular ou autre framework
- ❌ Ne pas créer de fichiers en dehors du dossier `/pluriquali/`
- ❌ Ne pas modifier la branche `main` directement — créer une branche et une PR

---

## 11. RÉSUMÉ DES LIVRABLES

1. ✅ Application Pluri'Quali fonctionnelle dans `/pluriquali/`
2. ✅ Écran de connexion (nom + email)
3. ✅ Formulaire de contrôle avec 5 sections, 25 critères, notation 4 niveaux
4. ✅ Dictée vocale sur tous les champs commentaires
5. ✅ Prise de photos avec prévisualisation
6. ✅ Plan d'actions
7. ✅ Scoring automatique avec 4 niveaux
8. ✅ Génération de rapport HTML téléchargeable
9. ✅ Ouverture automatique du client mail
10. ✅ Historique des contrôles en localStorage avec export CSV
11. ✅ PWA installable (manifest + service worker + icônes)
12. ✅ Charte graphique Pluri'Elles respectée (violet #6247AA, Playfair Display, DM Sans)
