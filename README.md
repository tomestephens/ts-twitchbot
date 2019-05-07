This is a super quick Typescript implementation of the tutorial for chat bots from the twitch site:
https://dev.twitch.tv/docs/irc/#building-the-bot

## Structure
Designed this so basically all you have to do is take the add new command classes and make sure they are initialized in the command handler. The rest just works.

# Run it
1. Copy `example.config.json` to `config.json`
2. Fill in your twitch details
3. ```npm install```
4. ```npm run start```