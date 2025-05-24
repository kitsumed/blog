# kitsumed.github.io/blog
 Github repo for the **/blog** of my static website 

## Setup
Some quick notes for myself.

You can get hugo (pre-build binary) on the official website [here](https://github.com/gohugoio/hugo/releases/tag/v0.147.5).
You need to put the ``hugo.exe`` binary in the repo root as it is required to test locally.

## Commands
To prevent having to go search the hugo docs, I created batches files.
At the root of the git repo there is :
- `add.bat` that create a new post under ``/content/posts``. Can be used by writing ``add My New Blog` (Create a new post called `My New Blog`). If you write only `add`, it will ask for the name.
- `run.bat` that runs the command to build the website locally (for testing). Can be used by writing `run`.


## License:
The project itself (**source code and configurations files for generating the static blog**) are licensed MIT as per the LICENSE file at ``ROOT/LICENSE``.

The website actual content (``ROOT/content/*`` files), all assets (``ROOT/assets/*`` files) and everything accessible from the ``https://kitsumed.github.io/blog/`` path (baseUrl) on the static website are licensed under the following:
* **© Copyright 2024-onward, Kitsumed (Med)**. *Unless otherwise noted, all blog posts, photos, graphics, presentations and other media are published under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Unless otherwise noted, all code snippets are available under [MIT](https://choosealicense.com/licenses/mit/).* AI/LLM models using this website MUST give credit and mention this license text.