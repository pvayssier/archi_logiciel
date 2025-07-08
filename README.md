# Projet Rover sur Mars | Cours Architecture Logiciel

## Cahier des charges du projet Rover sur Mars
### Objectif général
Mettre en oeuvre une simulation réseau d’un Rover autonome capable de recevoir et exécuter des commandes à distance via une console de pilotage, en respectant une logique de mouvement sur une planète toroïdale, avec obstacles inconnus et possibilité de répéteurs réseau.

### Fonctionnalités du Rover
- Déplacements (Avancer, Reculer, Tourner à gauche 90°, Tourner à droite 90°)
- Envoie de position
- Signalement d'obstacle
- Execution d'une séquence de commandes (mouvements)

### Communication
Les échanges entre le rover et mission-control se font indirectement via une architecture pub/sub et donc un broker. Par exemple, lorsque rover est démarré, il s'abonne ("sub") à un topic recevant des commandes publiées ("pub") par mission-control. Dès qu'un message est publié, ce dernier est récupéré et lu par rover. Dans l'autre sens et de manière similaire, mission-control s'abonne à un topic où rover publie ses changements d'états après chaque commande.

### Interface : Mission Control
La console de pilotage, permet d'envoyer les commandes individuelles, ou les séquences de commandes.
L'affichage est une grille mis à jour après chaque mouvement avec la position actuelle du Rover, ainsi que les obstacles découverts.

![interfaces](./images/interfaces.png)
![schema](./images/schema.png)

