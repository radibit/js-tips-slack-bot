'use strict';

require('dotenv').config();

var SlackBot  = require( 'slackbots' );
var ghget     = require( 'github-get' );

var bot = new SlackBot( {
    token : process.env.SLACK_TOKEN,
    name  : 'JS Tips'
} );

var params = {
  icon_url : 'https://raw.githubusercontent.com/radibit/js-tips-slack-bot/master/images/jstips-logo.png'
}

var options = {
  token : process.env.GH_TOKEN
};

var interval     = 7200000;
var oldJsTip     = {};
var jsTipMessage = '';

/**
 * Send the latest Js Tip
 *
 * @param  {String} path - URL path to the tip gh page
 * @return {String}      - Console logged error message
 */
function sendLatestTip( path ) {
  ghget( 'loverajoel/jstips', path, options, function( err, jsTip ) {
    if ( err ) {
      return console.warn( err );
    }

    jsTipMessage += '*Title:* `' + jsTip.content.substring(
      jsTip.content.indexOf( 'tip-tldr:' ) + 9, jsTip.content.indexOf( 'categories:' )
    ).trim() + '`';

    jsTipMessage += '\n\n*URL:* ';

    jsTipMessage += jsTip[ 'html_url' ];

    bot.postMessageToChannel( process.env.SLACK_GROUP, jsTipMessage, params );
  } );
}

/**
 * Get the latest JS Tip from the list of all available tips
 *
 * @return {String} - Console logged error message
 */
function getLatestTip() {
  ghget( 'loverajoel/jstips', '/_posts/en/', options, function( err, filenames ) {
    if ( err ) {
      return console.warn( err );
    }

    var newJsTip = filenames[ filenames.length - 1 ];

    if ( newJsTip.path !== oldJsTip.path ) {
      oldJsTip = newJsTip;

      sendLatestTip( newJsTip.path );
    }
  } );
}

getLatestTip();

setInterval( getLatestTip, interval );
