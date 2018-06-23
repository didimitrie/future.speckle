/**
 * This is a connection to the "dev" database. It's a free db on mongolab. 
 * To "inspect" & edit it, you can use Mongochef: http://3t.io/mongochef/ 
 *
 * THIS DB SHOULD BE CONSIDERED AS VOLATILE: data will probably be regularly flushed.
 */

module.exports = {
  //  mongodb://<dbuser>:<dbpassword>@ds041683.mlab.com:41683/auth-testing
  'url' : 'mongodb://dimitrie:redialtwice@ds261118.mlab.com:61118/betaspeckle'
  // 'url' : 'mongodb://didimitrie:Vict2Obor@ds041683.mlab.com:41683/auth-testing'
  //'url' : 'mongodb://didimitrie:Brussels2London@ds053305.mongolab.com:53305/futurespeckle'
}