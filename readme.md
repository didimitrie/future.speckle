# [Future.Speckle](http://beta.speckle.xyz)

#### About 
Share with your clients the full flexibility of your designs: display and explore parametric models in your browser. 
Check the service in action on [http://beta.speckle.xyz](http://beta.speckle.xyz).


##### Why? 
Design iteration has always been difficult to communicate with the right people, that's why we devised a tool to help leverage the felxibility of computational design in evnironments outside the architectural office. Parametric models can go beyond aesthetic and technical exploration: they can tell a story and they can be the base of collaborative decision making.

##### The Approach

SPK has very little moving parts, and is geared towards (eventual) **deployment for a wide range of non-technical users and environements**. The current front-end tech stack ensures that on any (evergreen) browser, your model is accesible - mobile devices are supported as well. 

All your models are pre-generated on your computer, so essentially the viewer is just loading and displaying static files. This means that there's no computational overhead and we are able to leverage native browser caching and compression - which is fast. 


#### The Parts

There are two main parts: 
- the server app (user registration & model api)
- the spk viewer (model viewer)

The SPK viewer is located in the /spkw and has, for now, its own build system :/ which might be confusing, but hey - we'll fix that. 


#### Getting started

`npm install` then `npm run watch-simple`


#### Running Locally

You'll need nodejs & npm installed. 


#### Deploying on your own server

If you want to deploy this to your own server (for various reasons), go ahead! Create a copy of the `config.local` folder, rename it `config` and pop in the details to your mongodb instance & auth0 app account. 

Please give us a heads up if you do this (:bow:).


#### Contributing

The `master` branch is the release branch. Whatever is there is online and running. 

The `dev` branch is where active development happens. For dev new reasons, always fork from `/dev`

Each feature should go in a fork of the `dev` branch, ie. `dev/my-new-super-feature`.

Ideally, we would follow [these guidelines](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) (thanks @philipbelesky).

**What can I contribute towards?** 
 - the backend
 - the viewer (/spkw)
 - the website proper
 - writing documentation
 - ...

#### Credits

Started off & currently maintained by [@idid](http://twitter.com/idid/). 

*Add yourself here if you contribute!*

Credits: 

- [The Bartlett, UCL](http://www.bartlett.ucl.ac.uk/) 
- [Innochain](http://innochain.net/)

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under the Marie Sklodowska-Curie grant agreement No 642877. 

#### GNU General Public License v2.0
Future.Speckle
Copyright (C) 2016 Dimitrie Andrei Stefanescu / The Bartlett School of Architecture, UCL

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
