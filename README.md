# Documentation

## Liste des tâches

### Gestion des utilisateurs

- [x] Créer, Lire, Mettre à jour, Supprimer l'utilisateur
- [x] L'utilisateur -> {id, email, pseudo, mot de passe, role}
- [x] Les utilisateurs normaux ne peuvent pas lire les informations sur un autre utilisateur, mais un employé peut vérifier les informations
- [x] Vous pouvez créer un nouvel utilisateur même sans être connecté
- [x] Vous pouvez seulement vous mettre à jour (les autres utilisateurs ne peuvent pas vous mettre à jour SAUF si admin)
- [x] Vous ne pouvez vous supprimer que vous-même (les autres utilisateurs ne peuvent pas vous supprimer)

### Authentification

- [ ] Différentes solutions peuvent être utilisées, le jeton jwt est recommandé (voir conseils pour plus d'informations)
- [ ] Tous les points de terminaison lus des données de train ne sont pas journalisés/anonymes 
- [ ] Tous les points de terminaison Write nécessitent que la requête soit authentifiée (stadeless)

### Gestion des trains

- [ ] Énumérez tous les trains et permettez de trier par date, station de départ, station de fin avec une limite (limite par défaut est 10 mais peut être changé avec un paramètre)
- [ ] Créer, Lire, Mettre à jour, Supprimer des trains
- [ ] Train -> {id, name, start_station, end_station, time_of_departure}
- [ ] Seul un administrateur peut créer, mettre à jour et supprimer un train

### Gestion des gares

- [ ] Énumérez toutes les gares et permettez de trier par nom
- [ ] Créer, Lire, Mettre à jour, Supprimer la gare
- [ ] Seul un administrateur peut créer, mettre à jour ou supprimer une gare (attention lorsque vous supprimez une gare, vous devez penser aux trains!)
- [ ] Gare -> {id, name, open_hour, close_hour, image}. L'image doit être redimensionnée à une image 200*200px si le téléchargement est trop grand

### Autres

- [ ] Pouvoir réserver un ticket et le valider
- [ ] Il est important de fournir de bons commentaires aux utilisateurs utilisant l'API afin que vous ayez besoin de mettre en œuvre une solution/validation de type simple comme Joi ou Yup ou AJV
- [ ] Sur la même note, vous devez utiliser le code HTTP valide lors du retour d'informations à l'utilisateur
- [ ] Les tests sont importants. Vous devez mettre en œuvre quelques tests sur votre projet. Concentrez-vous sur le test des fonctionnalités de base