---
title: "C'est quoi Shizuku ? Comment ca marche ? Les implications de sécurité ?"
date: '2026-01-30T12:00:00-05:00'
tags: ["Android","adb","Shizuku"]
comments: true
description: "Découvrez Shizuku, son fonctionnement et certaines des implications en matière de sécurité qui y sont associées!"
searchHidden: false
hidemeta: false
---
# C'est quoi Shizuku ?
Shizuku est une application Android dont l'objectif est de permettre à d'autres applications d'obtenir des autorisations de type root à l'aide d'ADB (elle prend également en charge les appareils rootés), via l'[Android Debug Bridge](https://developer.android.com/tools/adb).

ADB, étant un outil destiné à tester et déboguer les applications et le système d'exploitation Android, offre une alternative plus accessible aux utilisateurs qui souhaitent personnaliser leur appareil, mais qui ne le font pas ou ne le peuvent pas en raison des restrictions imposées par les fabricants (OEM) sur leur bootloader et des problèmes liés aux applications qui ne veulent pas s'exécuter sur les appareils rootés. ADB offre une alternative accessible.

Les premières versions d'ADB exigeaient que le débogage USB soit activé sur l'appareil et que celui-ci soit physiquement connecté à un ordinateur. Cela signifiait qu'à un moment donné, vous deviez toujours **être à proximité d'un ordinateur** pour pouvoir exécuter les commandes ADB. Cependant, à partir d'Android 11, ADB a pris en charge les connexions sans fil, **permettant l'accès à distance à partir d'appareils connectés au même réseau WiFi**. Bien que cela ait supprimé l'exigence de la connexion USB (physique), un ordinateur devait toujours être présent sur le même réseau.

C'est là que Shizuku entre en jeu. Comme Shizuku fonctionne directement sur l'appareil avec son propre client ADB, il ne peut pas utiliser les connexions USB. Cependant, grâce à l'introduction de Wireless ADB, Shizuku peut agir comme un « ordinateur » en se connectant à l'appareil lui-même à l'aide de l'adresse IP de loopback `127.0.0.1`. Cela signifie que vous n'avez plus besoin d'un ordinateur pour exécuter les commandes ADB.

Le rôle de Shizuku peut être résumé comme celui d'un gestionnaire : il établit une connexion ADB, la maintient active et, à la demande d'applications externe, exécute des commandes dans ca console. *(Avec une liste d'applications autorisées, bien sûr !)*

Cependant, cette approche présente également des inconvénients. ADB dispose de moins de permissions qu'une console fonctionnant en tant que root (superutilisateur), ce qui limite les actions possibles. Il reste très puissant, bien plus que ce qui est possible via l'interface standard du appareil.

# Comment ca marche ?
Voici une explication plus détaillée, du fonctionnement de l'application, ainsi que certaines des implications en matière de sécurité qui vienne avec. On va se concentrer sur le mode ADB de Shizuku, mais le mode root devrait fonctionner de manière similaire, sans les exigences ADB. Notez également que je ne suis pas un expert en sécurité, j'ai simplement lu le code et l'ai testé, puis j'ai noté mes observations.

Ces explications sont basées sur le [fork le plus populaire de Shizuku créée par thedjchi](https://github.com/thedjchi/Shizuku), car l'application Shizuku originale ne semble plus être activement maintenue avec de nouvelles fonctionnalités. La version originale devrait fonctionner de manière similaire.

### Que se passe-t-il lorsque vous lancez Shizuku pour la première fois ?
1. L'utilisateur doit activer manuellement le **débogage USB** et le **Wireless ADB** pour permettre à Shizuku de se connecter à l'appareil à l'aide d'ADB.
2. Shizuku guidera ensuite l'utilisateur dans le processus d'appairage du Wireless ADB afin qu'il soit autorisé à se connecter. Il s'agit d'un processus unique. Le processus d'appairage (avec code) ne devrait plus être nécessaire par la suite.
3. Une fois appairé, Shizuku s'accordera l'autorisation **WRITE_SECURE_SETTINGS**.  Une fois connecté à ADB, il utilisera l'autorisation **WRITE_SECURE_SETTINGS** pour désactiver le **Wireless ADB**.

### Ce qui se passe à chaque utilisation suivante :
1. Shizuku dispose déjà de l'autorisation **WRITE_SECURE_SETTINGS**.
2. Il vérifie si le **débogage USB** est activé. Si ce n'est pas le cas, il l'active afin de permettre et de maintenir la connexion ADB future.
3. Il active le **Wireless ADB**, se connecte via ADB, puis désactive à nouveau le **Wireless ADB**.

## Implications générales en matière de sécurité

1. Shizuku doit activer le **Wireless ADB** pour établir une connexion avec l'appareil lui-même (`127.0.0.1`). Cependant, dès que la connexion est établie, il désactive le **Wireless ADB**. Cela empêche les nouvelles connexions tout en maintenant les connexions existantes.
    - Il y a donc une très courte fenêtre pendant laquelle d'autres clients pourraient tenter de se connecter à l'appareil. Cependant, cela ne devrait pas poser de problème majeur, car un code pour l'appairage est affiché sur votre appareil lors de la première connexion.
  
2. Shizuku s'octroie l'autorisation **WRITE_SECURE_SETTINGS**, qui lui permet de modifier presque tous les paramètres de votre appareil, y compris le **débogage USB** et le **Wireless ADB**.
    - Cette autorisation est considérée comme critique et, par défaut, ne peut être utilisée que par les applications système.
    - Elle est nécessaire pour que Shizuku fonctionne plus facilement et, dans certains cas, de manière plus sécurisée. Cependant, elle pourrait permettre à Shizuku d'établir une connexion ADB quand bon lui semble.
    - Parcontre, la connexion ADB elle-même accorde beaucoup plus d'autorisations que **WRITE_SECURE_SETTINGS**.

3. Shizuku active le **débogage USB** sur votre appareil, ce qui réduit sa sécurité, principalement au niveau physique, que l'appareil soit verrouillé ou non. Il existe des CVE et des exploits zero-day, et l'activation d'ADB augmente le risque d'exploitation.
    - **Remarque** : pour qu'une connexion ADB reste active, le **débogage USB** doit rester activé, quelle que soit la manière dont la connexion a été établie.
    - Au moment où j'ai testé l'application, Shizuku ne désactivait pas le **débogage USB** une fois la connexion ADB est fermée. J'ai créé un ticket à ce sujet [ici](https://github.com/thedjchi/Shizuku/issues/110). Ticket qui recommande que Shizuku devrait activer le **débogage USB** lorsque nécessaire et le désactiver lorsqu'il ne l'est plus. Bien qu’ancienne et déjà corrigée, [le débogage USB comportait il y a longtemps des failles permettant de contourner l'invite de sécurité sur l'écran de verrouillage](https://labs.withsecure.com/advisories/android-4-4-2-secure-usb-debugging-bypass).


## Fonctionnalités : implications en matière de sécurité
Après avoir créé un ticket dans le dépôt, une description plus concise et plus détaillée des fonctionnalités a été ajoutée au [wiki](https://github.com/thedjchi/Shizuku/wiki#features). Je ne vais pas expliquer toutes les fonctionnalités, mais certaines méritent d'être mentionnées d'un point de vue sécurité. Depuis la création de cet post, d'autres fonctionnalités ayant des implications en matière de sécurité ont peut-être été ajoutées.

1. **Intégration avec des applications d'automatisation** : Shizuku utilise des **intents** pour permettre à des applications d'automatisation tierces d'envoyer des requêtes de démarrage et d'arrêt qui initient ou terminent une connexion ADB. Cela est utile pour les utilisateurs qui souhaitent démarrer ou fermer Shizuku automatiquement.
    - À l'heure actuelle, il n'existe aucun moyen de désactiver ou d'appliquer des restrictions à ces requêtes. Cela pourrait potentiellement être exploité par une application pour forcer l'activation du **débogage USB** et du **Wireless ADB**. Bien que cela ne soit pas nécessairement dangereux en soi, cela ouvre la porte à des risques supplémentaires. Un ticket a été créé [ici](https://github.com/thedjchi/Shizuku/issues/111) et des discussions sur la mise en place d'un système d'activation/désactivation ont commencé.

2. **Mode TCP** : le mode TCP, souvent appelé `ADB over TCP/IP`, est l'ancien mode de débogage « sans fil » d'ADB. En bref, il a été implémenté dans les premières versions d'Android et utilise la commande `adb tcpip`. Avant Android 11, où **Wireless ADB** a été introduit, vous deviez être physiquement connecté à l'appareil pour activer **ADB over TCP/IP**.

    **ADB sur TCP/IP** n'utilise aucun code de couplage pour la connexion initiale. Lorsqu'un appareil souhaitait se connecter, une fenêtre avec les options **Oui** et **Non** s'affichait sur l'appareil cible. De plus, **ADB sur TCP/IP** n'utilise pas TLS (le trafic était envoyé en texte clair).
    
    À partir d'Android 11, **Wireless ADB** a simplifié le processus et l'a rendu plus sûr. Vous n'aviez plus besoin d'une connexion physique, il y avait un code d'appairage initial et le trafic était désormais crypté à l'aide du protocole TLS !

    Mais il y a bien sûr un hic. Pour activer **Wireless ADB**, l'appareil doit être connecté à un réseau WiFi. C'est pourquoi l'ancien **mode TCP** a été ajouté, il ne nécessite pas que votre appareil soit connecté à un réseau WiFi. Pour en savoir plus sur les différences entre ces deux modes, consultez la documentation Android [ici](https://android.googlesource.com/platform/packages/modules/adb/+/HEAD/docs/dev/adb_wifi.md).
    - Cela signifie que le trafic entre votre appareil et le lookback (`127.0.0.1`) est **transmis en texte clair**. Bien que cela ne soit pas idéal, au moins le trafic reste sur votre appareil.
    - **Cependant**, tout appareil externe pouvant atteindre votre appareil via **ADB sur TCP/IP** peut initier une demande de connexion. Si vous appuyez accidentellement sur **Oui** dans la fenêtre contextuelle, félicitations, vous venez d'**accorder l'accès ADB à un appareil inconnu**.
    - Contrairement à **Wireless ADB**, vous ne pouvez pas désactiver **ADB sur TCP/IP** une fois que Shizuku a établi une connexion ADB. En fait, pour désactiver **ADB sur TCP/IP**, vous devez **redémarrer l'appareil**.

# Conclusion
Si vous n'avez besoin d'exécuter que quelques commandes ADB, il vaut probablement mieux installer une application de terminal comme [Termux](https://github.com/termux/termux-app) avec le client ADB. Cela dit, j'aime beaucoup le concept de Shizuku, car il offre un accès de type root aux applications de votre appareil sans avoir à le rooter. Cela rend certes votre appareil plus vulnérable, principalement sur le plan physique lorsque Shizuku est en cours d'exécution, mais c'est idéal pour la personnalisation, et la confidentialité (debloating, supprimer des autorisations, etc.).

Je pense également que Shizuku pourrait bientôt connaître un nouvel afflux d'utilisateurs. Android appartenant à Google, il souffre de nombreux problèmes similaires à ceux rencontrés par la plupart des produits issus d'entreprises en situation de monopole.

Par exemple, à partir de cette année, 2026, Google commencera à [restreindre le sideloading](https://android-developers.googleblog.com/2025/11/android-developer-verification-early.html) et exigera des développeurs qu'ils vérifient leur identité, même pour les applications hors du Play Store. En d'autres termes, **restreindre fortement l'installation** d'applications qui n'étaient pas spécifiquement **autorisées par les conditions d'utilisation du Play Store**, créées et **gérées par Google**, tout en exigeant **davantage d'informations personnelles** (et même **de l'argent** dans certains cas !) pour pouvoir installer **vos propres applications sur un appareil qui vous appartient.**. *Tout cela au nom de la sécurité des utilisateurs contre les scam call-center en Asie du Sud-Est !*

Dans la même [FAQ](https://developer.android.com/developer-verification/guides/faq), ils mentionnent également que si vous souhaitez installer des applications sans ces restrictions, vous devrez désormais utiliser ADB.

Voici ma pensée finale : j'ai hâte de voir comment ils vont justifier la désactivation des connexions **ADB sur TCP/IP** en loopback sur les appareils non émulés et commencer à exiger un compte Google pour établir des connexions **Wireless ADB** "sécurisées". *Il s'agit d'une satire, au cas où vous ne l'auriez pas compris.* J'espère que Shizuku vivra longtemps.