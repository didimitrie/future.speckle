/**
 * Dev instance for authentication handling on Auth0. 
 * The :9009 port is hardcoded in, any other callback urls will throw errors.  
 */

module.exports = {
  'baseUrl': 'http://localhost:9009',
  'clientId': 'xM4C16GZAbufm5citF6nJvj6wpAeYKlK',
  //'clientId': 'cAgai4q5J0lbIeNIsIHIXkRkmqrkXb8q',
  'clientSecret': 'r3e2VN0XJ3V96f0_uNFUD7stcIDZOTcXwfh-kQ6KFzTZVmCDVZnq_6PVN9z2LMKQ',
  //'clientSecret' : 'xBRFi5G_LYABkT2gLtIY5d4sQ5WdoNtbNG0cuulQ2viONhnqiAvvePn0XnrAk-O9',
  'domain': 'dim.eu.auth0.com'
}