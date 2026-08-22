                    ft_tranceandance 

Description :

    le but serai de faire un jeux pokemon-like / tft 
    flow d'une partie 


    phase 0 -> lancer une partie 

    - login
    - fenetre profil -> match historique 
                     -> stats overwall sur le compte 
                     -> liste d'amis et toute ses features : Add,delete,bloquer,inviter a un groupe pour rentrer en partie ensemble

    - possibiliter de parler dans un tchat general
    - possibiliter de lancer une partie (solo ou en groupe)
    
    ** si on lance une partie **

    phase 0.5

    - join queue
    - lobby created
    - if missing player -> AI fill 

    phase 1 -> Preparation 

    - profil load
    - choix de la map par upvote 
    - starter Selection
    - map exploration & constitution de son equipe
    - loot -> systeme d'objet donnant des avantage pour les combats
    - xp gain pour l'equipe via combat ou autre "loot" sur la map (implémentation d'un systeme d'evolution d'un monstre ?)

    phase 2 -> Matchmaking 
    
    - si un joueur deco fill with AI peut etre avec ses data ? 
    - team locked 
    - combat start

    phase 3 -> combat 

    deroulement d'un combat tour par tour 

    - player choississent leur action 
    - resolution des actions 
        -> attaque 
        -> objet 
        -> changement de monstre 
    - si un joueur n'a plus de monstre en vie fin du match 
    - assignation d'un perdant et d'un gagnant 

    phase 4 -> post match 

    - calcul des statistique 
    - update des profil 
        -> stats
        -> historique des partie mis a jour 
    - lancement d'un tchat 
    

    module du sujet viser : 

    WEB :  
    
        - Major : Use a framework for both the frontend and backend
        - Major: Implement real-time features using WebSockets or  similar technology

        - Major: Allow users to interact with other users. The minimum requirements are:
            ◦ A basic chat system (send/receive messages between users).
            ◦ A profile system (view user information).
            ◦ A friends system (add/remove friends, see friends list).

        - Major: A public API to interact with the database with a  secured API key, rate
            limiting, documentation, and at least 5 endpoints:
            ◦ GET /api/{something}
            ◦ POST /api/{something}
            ◦ PUT /api/{something}
            ◦ DELETE /api/{something}

        - Minor: Use an ORM for the database 

        - Minor: Progressive Web App (PWA) with offline support and installability 
            -> PWA = webapp installable avec des mécanismes permettant de mieux gérer les pertes réseau

        -  Minor: Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components)
            -> Un design system est un ensemble cohérent de règles, composants et styles pour construire l’interface d’une application.
            C’est une bibliothèque réutilisable qui permet de :

            - créer des interfaces uniformes
            - accélérer le développement
            - réduire les erreurs de design
            - améliorer la maintenabilité du frontend

        -  Major: Complete accessibility compliance (WCAG 2.1 AA) with screen reader support, keyboard navigation, and assistive technologies.

        - Minor: Support for additional browsers.
            ◦ Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge,
            etc.).
            ◦ Test and fix all features in each browser.
            ◦ Document any browser-specific limitations.
            ◦ Consistent UI/UX across all supported browsers.

        - • Major: Standard user management and authentication.
            ◦ Users can update their profile information.
            ◦ Users can upload an avatar (with a default avatar if none provided).
            ◦ Users can add other users as friends and see their online status.
            ◦ Users have a profile page displaying their information

        - Minor: Game statistics and match history (requires a game module).
            ◦ Track user game statistics (wins, losses, ranking, level, etc.).
            ◦ Display match history (1v1 games, dates, results, opponents).
            ◦ Show achievements and progression.
            ◦ Leaderboard integration.

        - • Minor: User activity analytics and insights dashboard.

    Artificial Intelligence : 

        - • Major: Introduce an AI Opponent for games. 
    
    Gaming and user experience : 

        - • Major: Implement a complete web-based game where users can play against each other.

        - Major: Remote players — Enable two players on separate computers to play the same game in real-time.

        -  Major: Multiplayer game (more than two players).

        - Major: Add another game with user history and matchmaking

        - Minor: Advanced chat features (enhances the basic chat from "User interaction"module).

        - Minor: Implement a tournament system.

        - Minor: Game customization options.

        - Minor: A gamification system to reward users for their actions.

        - Minor: Implement spectator mode for games.

    Devops : 

        - • Major: Infrastructure for log management using ELK (Elasticsearch, Logstash,Kibana).

        - 1️⃣ Définition -> ELK Stack = Elasticsearch + Logstash + Kibana
                        C’est un système complet pour collecter, stocker, analyser et visualiser des logs et des événements en temps réel.

        - Major: Backend as microservices

        - Minor: GDPR compliance features.

        Total des point si on fait tous ses module : 38 points au total a reduire ! (sinon le travaille va juste être trop)

    architecture en micro service 

     ![alt text](image.png)

     voici le decoupage brut du projet jusqu'a present 

     Domaine utilisateur — Auth Service (login, JWT, sessions) et Profile Service (stats, historique de parties). Ils sont appelés dès la phase 0 et restent au cœur de toutes les autres phases.

     Domaine jeu — Game Lobby (créer/rejoindre une partie), Preparation Service (exploration de map, loot, XP d'équipe), Matchmaking Service (file d'attente, création de lobby, remplissage par IA si joueur manquant), Combat Service (moteur du combat tour par tour), Post-Match Service (calcul des stats, mise à jour des profils, tchat de fin).

    Domaine social/transversal — Social Service (tchat général + liste d'amis) et Notification Service (push temps réel via WebSocket, pour notifier d'un match trouvé, d'un tour à jouer, etc.).
    
    Infrastructure — L'API Gateway est le point d'entrée unique (il vérifie les tokens, route les requêtes, gère le rate limiting). Le Message Broker (Kafka ou RabbitMQ) permet la communication asynchrone entre services — par exemple, quand le Combat Service déclare un gagnant, il publie un événement que le Post-Match Service consomme automatiquement, sans couplage direct.


    Project Management : 

    pour suivre le bon fonctionement de la team et la bonne approche pour le suivie de l'application nous avons decider de travailler comme cela 

    -> reunion 2 a 4 fois par mois selon la complexiter des taches du moment 

    -> repartition des rôle de Product Owner, Project Manager, et Tecklead pour que chacun ai son rôle a jouer et travailler dans un environement pro 

    -> avancement du projet selon la methode agile scrum : 
        decoupage du projet en "sprint" qui s'effectue selon un temps convenue entre deux reunion et calcul des taches prioritaire a implementer pour le bon suivie de l'application et eviter un maximum les retard 

    Moyen de communication : 

    slack : pour les echanges entre nous et avoir un groupe de communication 

    discord : pour les échanges de documentation et facilité le travaille en remote 

    github : versionning du projet 
