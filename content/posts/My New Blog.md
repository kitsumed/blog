---
title: 'My New Blog'
date: '2025-05-23T20:20:12-04:00'
tags: [blog-update]
comments: true
description: "This is my first blog post!"
searchHidden: false
---
Hey 👋 I'm finally able to write this. Settings this up right wasn't the most straight forward experience I had, but I still had some fun doing it.

## Story
I originally planned on using [Github Gists](https://gist.github.com/kitsumed) to make small interesting posts as I was too lazy to configure this type of blog.
Fast forward to now (*2025-05-23*) and after losing myself on the web, I came across a blog website that I really liked that used Hugo with the PaperMod theme.

This got me into this rabbit hole of setting up my own blog using Github Pages. I've watched a couple of tutorials, tried to understand [Hugo docs](https://gohugo.io/documentation/), (**Spoiler**: *I didn't understand a lot of things*), and read other users' blogs for around 3 to 4+ hours to configure my own Hugo instance.

### I write like sh*t, kind of
I finally finished configuring it to a level I like well, even though there are some configurations I have a very vague understanding of and some I still didn't manage to find in the official documentation. This blog should propose messages in English and French, as these are my two native languages. I think most of the content will be in English, I'm not sure yet. If you continue reading this, you might notice there are a lot of grammatical errors (*or not since I asked a AI to correct some of it*) and other weird-sounding words. I'm mostly writing words by their syllables, which often end up not being grammatically correct. It might also cause weird sentences. For example, at some point, I was getting confused with `witch` 🧙‍♂️ and `which`, who sound in a very similar manner. **My way of thinking on that subject is simple**: *As long as someone else is able to read and understand what I wrote, the goal was achieved*. This is why languages were created, to understand each other, communicate[^1].

### There's comments!!
Let's get back on the main subject, this blog. This blog also includes a comment section powered by [**giscus**](https://github.com/giscus/giscus). It's an open-source project that uses **Github Discussions** and their API to create a comment space, meaning that to send a comment, **you need a Github account**. I based my code heavely on the implementation I have seen on a [specific blog post](https://www.brycewray.com/posts/2023/08/making-giscus-less-gabby/#update-2024-01-25) I really liked who didn't load the third-party JavaScript until the user click on the comments button.

When I saw that giscus was the only big open-source alternative to use Github Discussions, I was disappointed. After all, part of their setup requires you to use a server-side API, and I wanted something fully local. Self-hosting my own instance would have also been too complicated, I wasn't willing to put that much effort into it. They also provide a hosted instance on Vercel, a platform to host your projects. This is great, but falls, (for me), into some sort of gray area.

How can I be sure they don't store the user authorizations on their server side? **The answer is simple, I can't**. As such, under the comments section, I added a text that tells users that if they are uncomfortable giving access to their account (given the scope giscus asks is limited, limiting what could be done maliciously), they can directly go on the Github discussion tab and write their comment themselves. Those will still show up in the comment section.

> [!NOTE]
> While I'm not a fan of a the hosted instance on Vercel, their [privacy policy](https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md) clearly states (*as of 2025-05-23*) that they does not collect any personal informations. There is also mention in their docs that your session, once logged in, is saved as a browser cookie (locally).


### Credits / Sources
Here are all of the websites and sources I used to configure the websites that where not mentioned in the post directly. I made additional modifications but refered myself to:
- https://gohugo.io/documentation/
- https://github.com/adityatelange/hugo-PaperMod/wiki
- https://discourse.gohugo.io/t/how-to-override-css-classes-with-hugo/3033
- https://discourse.gohugo.io/t/papermod-theme-how-to-add-custom-css/30165/5
- https://github.com/giscus/giscus
- https://gohugo.io/host-and-deploy/host-on-github-pages/


[^1]: [Stein J. F. (2003). Why did language develop?. PMID: 14662184.](https://pubmed.ncbi.nlm.nih.gov/14662184/)