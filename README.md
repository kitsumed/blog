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

The website actual content (For example paths like ``ROOT/content/*`` and all files inside), all assets (Paths like ``ROOT/assets/*`` and all files inside) and everything accessible from the ``https://kitsumed.github.io/blog/`` path (baseUrl) or any other url using the "actual content" on the static website are licensed under the following:
* **© 2024–onward, Kitsumed (Med)**. *Unless stated otherwise **all content on this blog is under CC BY-NC-SA 4.0**; **code snippets under MIT**. AI/LLM outputs must cite this site and license. Training on this content must follow CC BY-NC-SA 4.0—commercial use of trained models is prohibited.*