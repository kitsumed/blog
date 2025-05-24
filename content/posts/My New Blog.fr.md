---
title: 'Mon Nouveau Blog'
date: '2025-05-23T20:20:12-04:00'
tags: [blog-update]
comments: true
description: "Mon tout premier post de blog !"
searchHidden: false
---

Salut 👋 Je peux enfin écrire ceci. Configurer tout ça correctement n'a pas été l'expérience la plus simple que j'ai eue, mais je me suis quand même un amusé en le faisant.

## L'Histoire
À la base, je comptais utiliser [Github Gists](https://gist.github.com/kitsumed) pour faire de petits articles intéressants, parce que j'étais trop paresseux pour configurer un vrai blog comme celui-ci. Avance rapide jusqu'à maintenant (*2025-05-23*) : après m'être un peu perdu sur le web, je suis tombé sur un site de blog que j'ai vraiment aimé, qui utilisait Hugo avec le thème PaperMod.

C'est ce qui m'a fait tomber dans le terrier du lapin : mettre en place mon propre blog via Github Pages. J'ai regardé quelques tutoriels, essayé de comprendre la [doc de Hugo](https://gohugo.io/documentation/) (**Spoiler** : *je n'ai pas compris grand-chose*), et lu les blogs d'autres utilisateurs pendant environ 3 à 4+ heures pour réussir à configurer ma propre instance Hugo.

### J'écris comme un pied, en quelque sorte
J'ai enfin terminé la configuration à un niveau qui me plaît, même si certaines options restent floues pour moi et d'autres que je n'ai toujours pas trouvées dans la doc officielle. Ce blog devrait proposer des articles en anglais et en français, mes deux langues maternelles. Je pense que la majorité du contenu sera en anglais, mais je ne suis pas encore sûr. Si tu continues à lire, tu vas peut-être remarquer pas mal de fautes d'orthographe (*ou pas, vu que j'ai demandé à une IA d'en corriger*) et des mots qui sonne un peu bizarres. J'écris souvent les mots par syllabes, ce qui fait que l'orthographe est rarement correcte. Ça peut aussi donner des phrases étranges. Par exemple, à une époque, je confondais souvent (en Anglais) `witch` 🧙‍♂️ et `which`, qui se prononcent presque pareil. **Mon point de vue là-dessus est simple** : *tant que quelqu'un peut lire et comprendre ce que j'ai écrit, l'objectif est atteint*. C'est pour ça que les langues existent, pour qu'on puisse se comprendre, communiquer[^1].

### Y'a des commentaires !!
Revenons au sujet principal : ce blog. Il inclut aussi une section commentaires propulsée par [**giscus**](https://github.com/giscus/giscus). C'est un projet open-source qui utilise **Github Discussions** et leur API pour créer un espace de commentaires, ce qui veut dire que pour laisser un commentaire, **tu as besoin d'un compte Github**. Je me suis fortement inspiré [d'un article de blog](https://www.brycewray.com/posts/2023/08/making-giscus-less-gabby/#update-2024-01-25) que j'ai vraiment aimé, principalement car il ne charge pas le JavaScript d'un site externe tant que l'utilisateur ne clique pas sur le bouton commentaires.

Quand j'ai vu que giscus était la seule vraie alternative open-source basée sur Github Discussions, j'étais un peu déçu. Une partie de leur configuration repose sur une API côté serveur, et je voulais quelque chose de 100% local. Héberger ma propre instance aurait aussi été compliqué, je n'avais pas envie de faire autant d'efforts. Ils proposent aussi une instance hébergée sur Vercel, une plateforme pour héberger des projets. C'est bien, mais ça tombe (pour moi) dans une sorte de zone grise.

Comment puis-je être sûr qu'ils ne stockent pas les autorisations ("tokens/oauth2") utilisateurs sur leur serveur ? **La réponse est simple : je ne peux pas**. C'est pourquoi j'ai ajouté, sous la section des commentaires, un petit texte qui explique que si un utilisateur est mal à l'aise à l'idée de donner l'accès à son compte, il peut directement aller sur l'onglet "Discussions" du dépôt Github et y laisser son commentaire (même si les permissions demandée par giscus sont limitée, ce qui limite les abus potentiels). Ces commentaires apparaîtront quand même dans la section des commentaires du de l'article en question.

> [!NOTE]
> Même si je ne suis pas fan de l'instance hébergée sur Vercel, leur [politique de confidentialité](https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md) indique clairement (*2025-05-23*) qu'aucune information personnelle n'est collectée. Ils précisent aussi dans la documentation que la session ("token/oauth2"), une fois connecté, est sauvegardée localement via un cookie dans le navigateur.

### Crédits / Sources
Voici tous les sites et sources que j'ai utilisés pour configurer ce site, et qui ne sont pas mentionnés directement dans le post. J'ai fait pas mal de modifications perso, mais je me suis basé sur :
- https://gohugo.io/documentation/
- https://github.com/adityatelange/hugo-PaperMod/wiki
- https://discourse.gohugo.io/t/how-to-override-css-classes-with-hugo/3033
- https://discourse.gohugo.io/t/papermod-theme-how-to-add-custom-css/30165/5
- https://github.com/giscus/giscus
- https://gohugo.io/host-and-deploy/host-on-github-pages/

[^1]: [Stein J. F. (2003). Why did language develop?. PMID: 14662184.](https://pubmed.ncbi.nlm.nih.gov/14662184/)
