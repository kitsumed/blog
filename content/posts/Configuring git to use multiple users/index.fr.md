---
title: 'Configurer Git pour Utiliser Plusieurs Utilisateurs'
date: '2025-06-02T09:27:14-04:00'
tags: ["git","tutorial"]
comments: true
description: "Apprenez comment j'ai configuré Git globalement pour utiliser deux utilisateurs différents selon l'emplacement de mon dépôt de travail."
searchHidden: false
hidemeta: false
---
## Introduction
***Vous pouvez passer cette section si vous voulez juste copier-coller la configuration.***

J'ai récemment commencé à regarder certains modèles/projets d'IA et je me suis retrouvé à jouer avec [HuggingFace](https://huggingface.co/) encore une fois. Dans le processus, j'ai dû créer un nouveau modèle (dépôt) sur le site et j'ai rencontré un problème. Les informations de mon utilisateur Git par défaut utilisaient mon nom d'utilisateur et mon email GitHub. J'aurais pu les changer pour ce dépôt spécifique avec `git config user.[param]`, mais ça ne me plaisait pas. Ce n'était pas la première fois que j'avais ce problème, et honnêtement, j'oublie souvent la commande complète et je dois la chercher à nouveau.

Puis j'ai eu une idée : *Et si je pouvais changer automatiquement la configuration utilisateur selon le chemin du dépôt git courant?* J'ai cherché sur Google, StackOverflow, GitHub Gists et quelques blogs, et j'ai réussi à faire marcher ça.

## Prérequis
Vous avez besoin de [Git](https://git-scm.com/). C'est à peu près tout. Notez que **j'utilise Windows 11**, donc si vous êtes sous Linux, il faudra peut-être chercher un peu plus si vous avez des problèmes de chemins.
> [!NOTE]
> Ce n'est pas obligatoire, mais si vous utiliser [Github Desktop](https://github.com/apps/desktop), la configuration expliquée ici devrait aussi marcher.


## Configuration
La première étape est de localiser votre fichier de configuration Git global. Par défaut, ce fichier se trouve à la racine du profil utilisateur sous le nom `.gitconfig`. Vous pouvez accéder à la racine de votre profil utilisateur en appuyant sur **Win+R** > `%userprofile%`.

### Configuration des informations utilisateur (globale/par défaut)
Good, on passe à la partie fun. D'abord, on va définir les infos utilisateur par défaut qui seront utilisées globalement sur la machine pour la session utilisateur courante. Pour ce faire, ouvrez le fichier `.gitconfig` et collez ceci :
```ini
[user]
    name = Med
    email = <user-noreply>@users.noreply.github.com
```
Ça veut dire que `Med` et `<user-noreply>@users.noreply.github.com` seront les infos utilisateur par défaut utilisées pour tous les commits. Bien sûr, remplacez mes informations par vos propres valeurs.

### Changer la configuration selon l'emplacement du dépôt
Pour changer la config selon l'emplacement du dépôt courant, il faut faire deux choses. D'abord, **créez un nouveau fichier de config** :

Dans le même dossier que votre `.gitconfig`, créez un fichier vide nommé `.gitconfig-huggingface`. Dans ce fichier, copiez la même configuration utilisateur que vous aviez collez dans `.gitconfig`, puis remplacez les valeurs par vos infos pour l'utilisateur alternatif. Pour moi, comme je vais configurer mon utilisateur HuggingFace :
```ini
[user]
    name = kitsumed
    email = <user-noreply>@users.noreply.huggingface.co
```

Maintenant, **il faut ajouter une référence au nouveau fichier de config** dans votre fichier `.gitconfig` :
```ini
[user]
    name = Med
    email = <user-noreply>@users.noreply.github.com

# Charger la config HuggingFace quand le dépôt est un enfant du dossier HuggingFace
[includeIf "gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/"]
    path = .gitconfig-huggingface
```
Cette config indique à git que : *Si le chemin du dépôt commence par `C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/`, alors charge `.gitconfig-huggingface`*. Ça marche parce que Git garde seulement la dernière valeur définie pour chaque paramètre, donc en chargeant `.gitconfig-huggingface` vous écrasez les infos utilisateur par défaut (celles définies avant).

#### Exemple visuel / Debug
Voici un exemple plus visuel avec la commande `git config --list --show-origin` qui affiche les paramètres Git appliqués du premier au dernier :

**Dans n'importe quel dossier sauf dans huggingface**, la sortie devrait ressembler à ça :
```
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.name=Med
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.email=<user-noreply>@users.noreply.github.com
file:C:/Users/<YOUR-USERNAME>/.gitconfig    includeif.gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/.path=.gitconfig-huggingface
```
**Dans un dépôt _stocké dans_ le dossier huggingface**, la sortie devrait ressembler à ça :
```
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.name=Med
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.email=<user-noreply>@users.noreply.github.com
file:C:/Users/<YOUR-USERNAME>/.gitconfig    includeif.gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/.path=.gitconfig-huggingface
file:C:/Users/<YOUR-USERNAME>/.gitconfig-huggingface        user.name=kitsumed
file:C:/Users/<YOUR-USERNAME>/.gitconfig-huggingface        user.email=<user-noreply>@users.noreply.huggingface.co
```
Comme expliqué plus haut, Git utilise la dernière valeur définie. Ça veut dire que quand votre dépôt est dans le dossier HuggingFace, les dernières valeurs seront `kitsumed` et `<user-noreply>@users.noreply.huggingface.co`, ce qui change automatiquement vos infos utilisateur pour les commits.
> [!TIP]
> Ce truc ne ce limite pas juste aux infos utilisateur, **vous pouvez changer n'importe quelle config déjà définie avec cette méthode**. Par exemple, vous pourriez forcer la signature PGP uniquement dans un dossier spécifique, ou au contraire, partout sauf dans un dossier parent précis. Si ça vous intéresse, regardez la section [Sources](#sources) pour un lien vers un exemple sur la signature PGP.

## Sources
Ça fait plusieurs mois que j'ai fait cette config et les recherches, donc j'ai peut-être oublié certaines sources d'inspiration. Mais voici celles que j'ai pu retrouver :
- https://stackoverflow.com/a/43654115
- https://gist.github.com/Icaruk/f024a18093dc28ec1588cfb90efc32f7/ca5bb461f49be0cac3a06ae272befda4d5bf0be6
- https://git-scm.com/docs/git-config#_conditional_includes

Pour ceux intéressée par le PGP: Dans ma config locale, j'ai aussi configuré la signature PGP, j'écrirai peut-être un article dessus un jour (surtout que je suis sous Windows). Au départ, j'avais un problème pour utiliser PGP avec Github Desktop mais j'ai trouvé une solution. Là je suis un peu tanner d'écrire, donc si ça vous intéresse, [vous pouvez cliquer ici](https://gist.github.com/kitsumed/161a436ecbb38decee7b4df15f277c00) pour voir une petite note que j'ai faite sur Github Gist, qui est proche de ma config actuelle et inclut la signature PGP avec la solution pour Github Desktop. Ou laissez un commentaire et je ferai peut-être un nouveau post, qui sait...