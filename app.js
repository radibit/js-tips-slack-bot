'use strict';

require( 'dotenv' ).config();

var SlackBot = require( 'slackbots' );
var ghget    = require( 'github-get' );
var pg       = require( 'pg' );

pg.defaults.ssl = true;

var bot = new SlackBot( {
  token : process.env.SLACK_TOKEN,
  name  : 'JS Tips'
} );

var options = {
  token : process.env.GH_TOKEN
};

var interval     = 18000000;
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

    bot.on( 'open', function() {
      var params = {
        icon_url : 'https://raw.githubusercontent.com/radibit/js-tips-slack-bot/master/images/jstips-logo.png'
      };

      switch( process.env.SLACK_POST_TO ) {
        case 'group':
          bot.postMessageToGroup( process.env.SLACK_GROUP, jsTipMessage, params );
          break;
        case 'channel':
          bot.postMessageToChannel( process.env.SLACK_GROUP, jsTipMessage, params );
          break;
        default:
          bot.postMessageToGroup( process.env.SLACK_GROUP, jsTipMessage, params );
      }
    } );
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

    updateDbEntry( newJsTip );
  } );
}

/**
 * Update DB entry for the latest JS tip
 *
 * @param  {Object} latestJsTip - Meta info for the latest JS tip
 */
function updateDbEntry( latestJsTip ) {
  var isNewJSTip = false;

  pg.connect( process.env.DATABASE_URL, function( err, client ) {
    if ( err ) throw err;

    client
      .query( 'SELECT name FROM js_tip;' )
      .on( 'row', function( row ) {
        if ( latestJsTip.name !== row.name ) {
          isNewJSTip = true;

          client
            .query(
              'UPDATE js_tip SET name = ($1) WHERE msg_id = 1',
              [ latestJsTip.name ],
              function( err, result ) {
                if ( err ) throw err;
              }
            );
        }
      } );

    client
      .on( 'drain', function() {
        if ( isNewJSTip ) {
          sendLatestTip( latestJsTip.path );
        }
      } );
  } );
}

getLatestTip();

setInterval( getLatestTip, interval );
