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
Contains the basic markup of the page. It extends the `layout.jade` file, which provides some sort of basic structure and imports some basic functionality. Feel free to play around, switch menus around, etc.

####The SASS stylesheet `YourTemplateName.scss`
Styles the various elements of your interface. Easy peasy. It also imports some default styles of the app, but feel free to get rid of them (or improve them). If contributing to the main repo, please keep the UX direction laid out in the default template (ie, colours, drop shadows, slider styles).

####The JS file `YourTemplateName.js`
It intializes the whole stuff and it `requires` the core modules. Feel free to add your own, and require them up. 

##App Architecture (ie, the JS Modules)
Basically, you have *core modules* and *non-core* modules. I've ended up (against my intentions) writing a mini MVC pattern. It's bad, but there are a few advantages to it: **Low entry point** - you just need to know jQuery, and the conventions on how you handle data binding (or not) are your own. 

**NOTE:** I am open to divine intervention - if you feel like scrathcing this up and using react/vuejs/... be my guest. It was just too much for me to handle at the moment. 

Core modules are the ones that provide the basic functionality. Non-core modules just add **jazz** to the whole thing, ie. sliders, comments, metadata display, etc. They can interface with the html structure of the template file (most do), whereas the **non-core** modules do not, with one exception. See below.

###The **Core** Modules:
- `SPK.js` - only one to interface with an html element - it needs a place to drop the canvas.
- `SPKLoader.js` - loads and parses the json file
- `SPKObjectMaker.js` - makes threejs objects from parsed json files
- `SPKConfig.js` - tells SPK what are the api endpoints (ie what urls to call on the server)

###The **Non-Core** Modules: 
- `SPKSliderControl.js` - makes the parameter sliders and perfomance measures from the params.json file of every model. 
- `SPKLogger.js` - This is what my research is about, soz. In the future content creators will have acess to this in a nice dashboard. 
- `SPKCommentsControl.js` - This one handles saving and re-instating instances (parameter key + camera postiton + user description). 
- `SPKHelpControl.js` - The last tab in the `Default` interface, a bit of a help file. 
- **`YOUR NEW STUFF`** - The sky's the limit. 

###How To Create Your Own Interface
Walk through the creation of, say, a new SliderControl.




