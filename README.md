

![icicle](https://repository-images.githubusercontent.com/280492379/1b976300-ca97-11ea-81bf-f93685167ec4)

## The code for the app [https://icicle.wintercore.dev/](https://icicle.wintercore.dev/)
### Enjoy listening to podcasts/music/etc through youtube with your friends in real time

[![Actions Status](https://github.com/WinterCore/icicle/workflows/Deploy/badge.svg)](https://github.com/WinterCore/icicle/actions)

## How to run locally

* Install [Node](https://nodejs.org/en/)
* Clone this repository `git clone https://github.com/WinterCore/icicle.git`
* Change your current working directory to the cloned repo `cd icicle`
* run `npm install`
* Make an [OAuth consent screen](https://medium.com/@pablo127/google-api-authentication-with-oauth-2-on-the-example-of-gmail-a103c897fd98) and copy the credentials to the `config/server.ts` file under the name `GOOGLE_CONFIG`
* Get a [youtube api key](https://elfsight.com/help/how-to-get-youtube-api-key/) and copy it to the `config/server.ts` file under the name `YOUTUBE_API_KEY`
* Change the mongodb credentials port and url according to your local setup (`config/server.ts`)
* Scripts
  * `npm run server:dev` Starts the server in dev mode using nodemon
  * `npm run server:build:watch` Build the server code and watch for changes (dev mode)
  * `npm run server:build` Builds the server code
  * `npm run frontend:build` Builds the frontend code
  * `npm run frontend:dev` Starts a webpack-dev-server instance (dev mode)
