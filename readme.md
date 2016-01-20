#Future.Speckle
(future of speckle.xyz)

Web service that allows for uploading and deleteing user models for the future speckle endeavour. 

###Structure:
User management: Auth0 + (TODO) mongodb @ mongolab

Model management: mongodb @ mongolab + local app fs

###TODOS:
#### 1. Authorization & User mngmt + Viewing permissions

Is handled by Auth0
- ~~replicate on our side on user signup.~~ DONE

Viewing permissions on the models would be good (JWT tokens maybe?). Three options: 
- public models (they get added to the public gallery)
- private models (only sharable with link)
- private private models (only visible to the author)

#### 2. User Models API

**Model Uploads** (POST /api/models)
- ~~We now handle file uploads and file deletion in quite a bad way. A progress bar would be nice, since we're expecting rather big files.~~ DONE
- ~~Unzip files on upload to their specific folder.~~ DONE
- ~~Update User Disk Space usage on upload (need user replication on our side)~~ DONE
- Maybe upload to cheap storage somewhere.

**Model Deletion** (GET /api/delete/:id)
- Should be a DELETE request. 
- It works though.

**Model Editing** (PUT /api/models/:id)
- ~~Rename model, set permissions~~ OUT OF MVP SCOPE

**Model Viewing** 
- Implement a graceful route to the speckle viewer that allows for auth strategies later on

#### 3. Documentation

Quite important. Things that need doing:
- getting started guide
- examples files
- usage scenarios
- file format doc (so we can allow for exports from other param software)


#### 4. License
Future.Speckle
Copyright (C) 2016 Dimitrie Andrei Stefanescu

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
