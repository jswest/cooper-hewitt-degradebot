    ██████▒▒  ░░██████  ▓▓████▒▒░░██████░░
    ██  ░░██░░██▒▒  ░░  ▓▓▒▒░░██░░██  ▒▒██
    ██    ██▒▒██  ░░██░░▒▒████░░░░██    ██░░
    ██░░▒▒██  ▓▓▓▓  ██▒▒▓▓▒▒▓▓▒▒░░██░░▓▓██
    ▓▓▓▓▓▓░░    ▓▓██▓▓  ▒▒░░░░▓▓░░▓▓▓▓▓▓

---

Welcome to Cooper Hewitt Degradebot, an ASCII art generator for the Cooper Hewitt museum's collection.

## Installing it

-   Install Imagemagick.
-   Install NVM or whatever it takes to get Node and NPM on your machine.
-   Clone this repository.
-   Run `npm install`.
-   If you have trouble installing `node-canvas`, you'll have to follow their instructionos: https://github.com/Automattic/node-canvas/wiki/_pages.
-   You'll need an API access token from Cooper Hewitt: https://collection.cooperhewitt.org/developers.
-   You'll need Twitter API keys: https://developer.twitter.com/content/developer-twitter/en.html.
-   Run `cp sample-config.json config.json`.
-   Put those keys and tokens in the right place.

NB: you might have some trouble with this installing the Asciist. Run `npm install --save https://github.com/jswest/asciist/archive/v1.tar.gz`

## Running it

-   Run `node index.js`.
-   If you want to run it on a server, deploy it (I can't help you there).
-   Use `screen` or similar, then run `npm run start`.
