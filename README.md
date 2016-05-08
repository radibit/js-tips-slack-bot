# JS Tips Slack Bot

Slack Bot implementation for sending the latest JS tips collected in https://github.com/loverajoel/jstips.


## Install Node.js and npm

This is a Node.js app, so the first step is to be sure you have installed Node.js and npm:

- OS X

Go to [nodejs.org](nodejs.org), Click `install`, and run through the install process.

- Ubuntu

You can use the  Node.js binary distributions

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

More installation help at https://github.com/nodesource/distributions#deb

- Windows

Go ahead to download the Windows binary at [https://nodejs.org/en/download/](https://nodejs.org/en/download/)


## Clone this repo

Next step is to clone this repository using the following command:

```
git clone git@github.com:radibit/js-tips-slack-bot.git
```

and navigate to the cloned project folder:

```
cd js-tips-slack-bot
```


## Installation

In the project folder run the command

```
npm install
```

in order to install locally the required dependencies.


## Config

There are four config variables for this project:
- `GH_TOKEN` - GitHub API token - can be generated from your GitHub [settings panel](https://github.com/settings/tokens)
- `SLACK_TOKEN` - Slack API Token - in order to create one visit [Slack API settings](https://api.slack.com/web)
- `SLACK_GROUP` - Target Slack group - specify the Slack group that will receive the messages
- `SLACK_POST_TO` ( optional ) - Specify if the messages should be posted to a private group ( `group` ) which is the default option or a public channel ( `channel` )
- `DATABASE_URL` - Heroku Postgres URL - provide URL in order to connect the app to a Postgres database. Once you installed the Heroku Postgres add-on  you can find the required information on the [connection settings](https://postgres.heroku.com/databases) panel


## Test it locally

First you need to create `.env` file in the root folder of the project and list there the required config variables.
You can use as a reference the `.sample-env` file.

After providing the required values for the config variables, you can run the app with the following command:

```
npm run start
```

If you want to end the started terminal process, you can do this using <kbd>ctrl</kbd> + <kbd>c</kbd>

Playing with the script you can adjust whether you want to send the js tip to a Slack group ( default ), channel or single user. More info about the exposed methods of the [Slack's Real Time Messaging API](https://api.slack.com/rtm) can be found [here](https://github.com/mishk0/slack-bot-api#methods)



## Heroku set up and deployment

It's fun to play locally with the app :smiley:, but the real benefit of using it comes when we deploy it and set it up to automatically send us the new JS tips every day. So let's do this:

1. Create an account and download Heroku [https://toolbelt.heroku.com/](https://toolbelt.heroku.com/)

2. Rename the `.sample-env` file to `.env` inside of the project folder and replace the placeholder variables with real tokens/values (see [Config](#config) section)

3. In the terminal, within the project folder, run the following command to create a new Heroku app:

```
heroku create
```

More help info how to use the Heroku CLI can be found on the [Heroku DevCenter](https://devcenter.heroku.com/categories/command-line)  

4. Commit and push the Heroku app:

```
git add -f .env

git commit -m "Added private tokens that I promise to never-ever-ever share with the public."

git push heroku master
```

With the last command you are actually deploying your app to Heroku and after that it will be already running live.

5. You can find your new app listed in the [Heroku dashboard](https://dashboard.heroku.com/apps)

6. Set up a database in order to store the latest JS tip and send a Slack message only when there is a new one. 

You need to configure the Heroku Postgres add-on and create a table with a name `js_tip` and two columns - `msg_id` ( PRIMARY KEY ) and `name` ( varchar (250) )

7. Enjoy :tada:
