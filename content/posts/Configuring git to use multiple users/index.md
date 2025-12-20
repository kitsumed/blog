---
title: 'Configuring Git to Use Multiple Users'
date: '2025-06-02T09:27:14-04:00'
tags: ["git","tutorial"]
comments: true
description: "Learn how I configured Git globally to use two different users depending on the location of my working repository."
searchHidden: false
hidemeta: false
---
## Introduction
***You can skip this section if you just want to copy-paste the configuration.***

I recently started looking at some AI models/projects and found myself playing with [HuggingFace](https://huggingface.co/) again. In the process, I had to create a new model (repository) on the website and encountered a problem. My default Git user information was using my GitHub username and email. I could have changed them for that specific repository using `git config user.[param]`, but I was not a fan of that. It was not the first time I had this problem, and to be honest, I often forget the full command and have to search for it again.

Then I had an idea: *What if I could automatically change the user configuration depending on the current working repository or parent directory?* I searched on Google, StackOverflow, GitHub Gists, and some blogs, and managed to get it working.

## Prerequisites
You need [Git](https://git-scm.com/). That's pretty much all. Do note that **I'm using Windows 11**, so if you are on Linux you may need to do some additional search if you have path issues.
> [!NOTE]
> This isn't required, but if you're a [Github Desktop](https://github.com/apps/desktop) user, the configuration we will be doing should also work.


## Configuration
The first step is to locate your global Git config file. By default, this file is located at the root of the current user profile under the name `.gitconfig`. You can access the root of your user profile by pressing **Win+R** > `%userprofile%`.

### Setting up user information (globally/default)
Okay let's get to the fun part. First, we will define the default user information that will be used globally on the machine for the current user session. To do this, open the `.gitconfig` file and paste the following:
```ini
[user]
    name = Med
    email = <user-noreply>@users.noreply.github.com
```
This mean that `Med` and `<user-noreply>@users.noreply.github.com` will be the default user informations used for any commits. Of course, you should remplace the values with yours.

### Changing settings depending on the current repository location
To change the configuration depending on the current repository location, we need to do two things. First, **we need to create a new config file**:

In the same directory as your `.gitconfig`, create an empty file named `.gitconfig-huggingface`. In that file, copy the same user configuration you used in `.gitconfig`, then replace the values with your alternate user information. In my case, since I am going to configure my HuggingFace user:
```ini
[user]
    name = kitsumed
    email = <user-noreply>@users.noreply.huggingface.co
```

Now, **you need to add a reference to the new config file** in your `.gitconfig` file:
```ini
[user]
    name = Med
    email = <user-noreply>@users.noreply.github.com

# Load the huggingface commit user informations when the repo is inside the huggingface directory
[includeIf "gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/"]
    path = .gitconfig-huggingface
```
This configuration will tell git to do the following: *If the current git working directory start with `C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/`, then load `.gitconfig-huggingface`*. This works because Git only hold the last value defined in the settings, this mean that by loading `.gitconfig-huggingface` you are overwriting the default user informations (thoses defined before loading our new configuration file).

#### Visual Example / Debugging
Here's a more visual example using the command `git config --list --show-origin`, which will display the Git parameters values in order, from the first to the last applied value:

**In any directory except inside the huggingface directory**, the output should be close to:
```
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.name=Med
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.email=<user-noreply>@users.noreply.github.com
file:C:/Users/<YOUR-USERNAME>/.gitconfig    includeif.gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/.path=.gitconfig-huggingface
```
**In all repository stored _inside_ the huggingface directory**, the output should be close to:
```
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.name=Med
file:C:/Users/<YOUR-USERNAME>/.gitconfig    user.email=<user-noreply>@users.noreply.github.com
file:C:/Users/<YOUR-USERNAME>/.gitconfig    includeif.gitdir:C:/Users/<YOUR-USERNAME>/Documents/HuggingFace/.path=.gitconfig-huggingface
file:C:/Users/<YOUR-USERNAME>/.gitconfig-huggingface        user.name=kitsumed
file:C:/Users/<YOUR-USERNAME>/.gitconfig-huggingface        user.email=<user-noreply>@users.noreply.huggingface.co
```
As explained earlier, the last value of a setting is the one used by Git. This means that when your working repository is stored inside the HuggingFace directory, the last value will be `kitsumed` and `<user-noreply>@users.noreply.huggingface.co`, effectively changing your commit user information automatically.
> [!TIP]
> This trick does not limit itself to user informations, **you can overwrite any previously defined settings using this method**. As a example, you could enforce PGP signing by default only when under a specific directory, or do the countrary, enforce it everywhere except for all repo inside a specific directory. If you're interested about a PGP signing example, check the [Sources](#sources) section.

## Sources
It has been multiple months since I made this configuration, so I may be missing some of the sources I originally drew inspiration from. But here are the ones I was able to find again:
- https://stackoverflow.com/a/43654115
- https://gist.github.com/Icaruk/f024a18093dc28ec1588cfb90efc32f7/ca5bb461f49be0cac3a06ae272befda4d5bf0be6
- https://git-scm.com/docs/git-config#_conditional_includes

Additionaly, in my own local config, I also configured PGP signing, which I might make a blog post about at some point (as I'm on windows), Originally I also had a issue when trying to use PGP with Github Desktop but managed to find a solution. Right now I'm kind of tired of writing, so if you're interested, [you can click here](https://gist.github.com/kitsumed/161a436ecbb38decee7b4df15f277c00) to see a small note I made on Github Gist that are closer to my current config and include the PGP with the work-around for Github Desktop. Or leave a comment and I might do a new post, maybe...