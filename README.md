# archi_logiciel

📄 Cahier des charges du projet Rover sur Mars
🎯 Objectif général
Mettre en œuvre une simulation réseau d’un Rover autonome capable de recevoir et exécuter des commandes à distance via une console de pilotage, en respectant une logique de mouvement sur une planète toroïdale, avec obstacles inconnus et possibilité de répéteurs réseau.

1. 🧠 Fonctionnalités du Rover
📍 État initial
Position initiale connue : (x, y)

Orientation initiale : N, S, E, W

Taille connue de la planète : (width, height)

🧭 Mouvements
Avancer

Reculer

Tourner à gauche (90°)

Tourner à droite (90°)

Mouvement avec rebouclage (topologie toroïdale)

Exécution d’une séquence de commandes

🧱 Obstacles
Lorsqu’un obstacle est rencontré :

Le Rover s’arrête

Il signale l’obstacle et renvoie sa position

Les commandes déjà exécutées ne sont pas annulées

Le reste de la séquence est interrompu

📤 Communication
Le Rover écoute sur un port réseau

Il reçoit une séquence de commandes

Il renvoie son état après chaque commande (position + orientation ou erreur)

2. 💻 Interface : Mission Control
🎮 Console de pilotage
Interface CLI (ou UI simple) pour envoyer :

Des commandes individuelles (A, R, L, D…)

Des séquences de commandes

Affichage :

Carte (grille) mise à jour après chaque mouvement

Position actuelle du Rover

Obstacles découverts

3. 📡 Communication réseau
🌍 Topologie
Communication indirecte Mars–Terre

Répéteurs optionnels à insérer dans le réseau

Chaque répéteur retransmet les messages (type "hop")

4. 🏗️ Architecture recommandée
🧱 Architecture distribuée orientée message
🔌 Protocole réseau
Recommandé : MQTT ou ZeroMQ

Léger, efficace, adapté aux architectures distribuées

Possibilité de chaîner les répéteurs (brokers ou proxies)

Publication/souscription aux messages (topic: rover/command, rover/status)

Alternatives :
HTTP REST si architecture plus simple (mais plus rigide)

WebSocket si besoin de canal bidirectionnel permanent

TCP/UDP brut si projet orienté performance bas niveau (plus complexe)

🗂️ Composants du système
Rover (serveur) : écoute sur un port et traite les commandes.

MissionControl (client) : interface de pilotage + carte.

Répéteurs (optionnels) : ponts ou proxys qui relaient les messages.

5. 🔐 Gestion des erreurs
Timeout si Rover ne répond pas

Affichage d’erreurs si la séquence échoue

Affichage de la cause de l’arrêt (obstacle, réseau, etc.)

6. 🧪 Simulation / Tests
Mode démo : pilotage manuel (au clavier)

Mode auto : séquence préprogrammée

Mode debug : affichage pas à pas du traitement des commandes