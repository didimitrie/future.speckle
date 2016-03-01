# [Beta.Speckle](http://beta.speckle.xyz)
*[namechange under public consideration](https://github.com/didimitrie/future.speckle/issues/12)*

## About 
Beta.Speckle is an online parametric model viewer. It enables sharing with your clients/stakeholders/community flexible designs, not just static artefacts. 

Check the service in action on [http://beta.speckle.xyz](http://beta.speckle.xyz). For now, it is developed by [@idid](http://twitter.com/idid).

##Why? 
Design iteration has always been difficult to communicate with the right people, that's why we devised a tool to help leverage the felxibility of computational design in evnironments outside the architectural office. 

#####**Parametric models can go beyond aesthetic and technical exploration: they can tell a story and they can be the base of collaborative decision making**.

##The Approach

SPK has very little moving parts, and is geared towards (eventual) **deployment for a wide range of non-technical users and environements**. 

The current front-end tech stack ensures that on any (evergreen) browser, your model is accesible - mobile devices are supported as well. This is possible one of the few requirements - accesibility and software independence. 

All your models are pre-generated on your computer, so essentially the viewer is just loading and displaying static files. This means that there's no computational overhead and we are able to leverage native browser caching and compression - which is fast.

##The Parts

There are three main parts: 
###1. The Backend
Contains: 
- the API
- the landing page
- user registration
- user profile page

###2. The Viewer
This is a static front-end that loads & displays the parametric models. It resides within the `/spkw` directory and is a littl independent module of its own. Check its readme for more information.

###3. The Grasshopper Exporter
Has its **[own github repo](https://github.com/didimitrie/speckle.exporter)**. It currently only exists for Rhino/GH.
*There are other parametric software out there that hopefully you'll help us export from!*

##Getting started with hacking on your local machine

**Important notice: build and watch systems will soon (hopefully) be unified in something more straightforward. Until then, voila the temporary instructions:**

- For the backend: `npm install` then `npm run watch-simple` in the repo root.
- For the viewer, then `cd spkw` and `npm install` and then `npm run watch-remote`

Point your browser to `localhost:9009` and you should be good to go. 

**If developing on windows** be sure to check [issue #25](https://github.com/didimitrie/future.speckle/issues/25). There are some platform specific troubles that are not yet fixed.

###Deploying on your own server

If you want to deploy this to your own server (for various reasons), go ahead! You will need: 
- a mongodb instance running somewhere 
- an [Auth0](auth0.com/) account if you plan to support authentication

Please give us a heads up if you do this :bow:.

##Contribution Guidelines

See the contribution guidelines.

##The Project, Why FOSS, and Why Contribute

The infrastructure for this project is financed for the following three years. See the [Credits](https://github.com/didimitrie/future.speckle#credits). Part of our philosophy is to develop this together closely with the stakeholders and end-users, as such any contributions are welcome: feel free to propose new code architecture, features, etc.

##Credits

Started off & currently maintained by [@idid](http://twitter.com/idid/). *Add yourself here if you contribute!*

The project is underway at **[The Bartlett, UCL](http://www.bartlett.ucl.ac.uk/)**, within the **[Innochain](http://innochain.net/)** Research Project.

**This project has received funding from the European Union’s Horizon 2020 research and innovation programme under the Marie Sklodowska-Curie grant agreement No 642877.**

##License

GNU General Public License v3.0
Future.Speckle
Copyright (C) 2016 Dimitrie Andrei Stefanescu @idid / The Bartlett School of Architecture, UCL

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
