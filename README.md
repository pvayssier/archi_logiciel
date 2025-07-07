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

Le Rover écoute sur un port réseau. Reçoit une séquence de commandes, et renvoie son état après chaque commande
La communication se fait en HTTP REST

### Interface : Mission Control

La console de pilotage, permet d'envoyer les commandes individuelles, ou les séquences de commandes.
L'affichage est une grille mis à jour après chaque mouvement avec la position actuelle du Rover, ainsi que les obstacles découverts.

```
npm run build:ui
```

```
serve -s dist/ui
```
