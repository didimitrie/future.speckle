#SPKW
Parametric model explorer based on on webgl (threejs)

###Install
Even though you ran npm install in future.speckle, you still need to do it here too. The viewer acts as a little independent module of his own.

If you're coming from future.speckle, then cd in spkw/ and go ahead and: 
- `npm install` / `sudo npm install`
- `npm run watch` to see live changes

If developing on windows, please check [issue #25](https://github.com/didimitrie/future.speckle/issues/25). There are some platform specific troubles that are not yet fixed.

##Interface Architecture
A typical SPKW interface is structured around the following:
- a jade template, ie. `Default.jade`
- a sass stylesheet, ie. `Default.scss`
- a js file, ie. `Default.js`

**In order to register a new interface on the backend**, please pop open the `future.speckle/app/routes/viewer.js` and add yours there, with its own little prefix. You can then experiment with your model by going to `http://localhost:9009/view/**yourprefix**/modelKey`.

*TODO: A better system for routing to various interfaces.*

####The Jade template, `YourTemplateName.jade`
Contains the basic markup of the page. It extends the `layout.jade` file, which provides some sort of basic structure and imports some basic functionality. If you want your inter

####The SASS stylesheet `YourTemplateName.scss`
Styles the various elements of your interface. Easy peasy. It also imports some default styles of the app, but feel free to get rid of them (or improve them). If contributing to the main repo, please keep the UX direction laid out in the default template (ie, colours, drop shadows, slider styles).

####The JS file `YourTemplateName.js`
It intializes the whole stuff and it `requires` the core modules. Feel free to add your own, and require them up. 

##App Architecture (ie, the JS Files)
