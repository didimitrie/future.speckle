# [Beta.Speckle](http://beta.speckle.xyz)
*[namechange under public consideration](https://github.com/didimitrie/future.speckle/issues/12)*

## About 
Beta.Speckle is an online parametric model viewer. It enables sharing with your clients/stakeholders/community flexible designs, not just static artefacts. 

Check the service in action on [http://beta.speckle.xyz](http://beta.speckle.xyz). For now, it is developed by [@idid](http://twitter.com/idid).


## Why? 
Design iteration has always been difficult to communicate with the right people, that's why we devised a tool to help leverage the felxibility of computational design in evnironments outside the architectural office. 

#####**Parametric models can go beyond aesthetic and technical exploration: they can tell a story and they can be the base of collaborative decision making**.


## The Project, Why FOSS, and Why Contribute

The infrastructure for this project is financed for the following three years. See the [Credits](https://github.com/didimitrie/future.speckle#credits). Part of our philosophy is to develop this together closely with the stakeholders and end-users, as such any contributions are welcome: feel free to propose new code architecture, features, etc.

Ideally we would develop a flexible system that would allow for plug-and-play functionality that can be catered to a mulitude of usage scenarios. 

## The Approach

SPK has very little moving parts, and is geared towards (eventual) **deployment for a wide range of non-technical users and environements**. The current front-end tech stack ensures that on any (evergreen) browser, your model is accesible - mobile devices are supported as well. This is possible one of the few requirements - accesibility and software independence. 

All your models are pre-generated on your computer, so essentially the viewer is just loading and displaying static files. This means that there's no computational overhead and we are able to leverage native browser caching and compression - which is fast.



## The Parts

There are three main parts: 
- the server app (model api, user registration, db, etc.)
- the spk viewer (model viewer, inside `/spkw`)
- **[the grasshopper exporter](https://github.com/didimitrie/speckle.exporter)**
  - currently only written for Rhino/GH. It resides in a separate repo [here](https://github.com/didimitrie/speckle.exporter)
  - *There are other parametric software out there that hopefully you'll help us export from!*


## Getting started with hacking on your local machine

**Important notice: build and watch systems will soon (hopefully) be unified in something more straightforward. Until then, voila the temporary instructions:**

- For the backend: `npm install` then `npm run watch-simple` in the repo root.
- For the viewer, then `cd spkw` and `npm install` and then `npm run watch-remote`

Point your browser to `localhost:9009` and you should be good to go. 


## Deploying on your own server

If you want to deploy this to your own server (for various reasons), go ahead! You will need: 
- a mongodb instance running somewhere 
- an [Auth0](auth0.com/) account if you plan to support authentication

Please give us a heads up if you do this :bow:



## Contribution Guidelines

The `master` branch is the release branch. Whatever is there is online and running. 

The `dev` branch is where active development happens. Always fork from `/dev` for new features. 

Each new feature should go in a fork of the `dev` branch, ie. `dev/my-new-super-feature`. Once ready, submit a PR.

Ideally, we would follow [these guidelines](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) (thanks @philipbelesky).

**What can I contribute towards?** 
 - the backend
 - the viewer (/spkw)
 - the website proper
 - writing documentation
 - pretty much anything: everytime i try and sit down and do a todolist, i'm getting depressed. 


## Credits

Started off & currently maintained by [@idid](http://twitter.com/idid/). 

*Add yourself here if you contribute!*

Credits: 

- **[The Bartlett, UCL](http://www.bartlett.ucl.ac.uk/)**
- **[Innochain](http://innochain.net/)**

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under the Marie Sklodowska-Curie grant agreement No 642877. 

## License

GNU General Public License v2.0


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
