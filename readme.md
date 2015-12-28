#Future.Speckle
(future of speckle.xyz)

###Structure:
User management: Auth0 + (TODO) mongodb @ mongolab
Model management: mongodb @ mongolab + local app fs

###TODOS:
#### 1. Authorization & User mngmt + Viewing permissions

Is handled by Auth0, we need to replicate on our side. 
Viewing permissions on the models would be good (JWT tokens maybe?). Three options: 
- public models (they get added to the public gallery)
- private models (only sharable with link)
- private private models (only visible to the author)

#### 2. API

**Model Uploads** (POST /api/models)
- We now handle file uploads and file deletion in quite a bad way. A progress bar would be nice, since we're expecting rather big files. 
- Unzip files on upload to their specific folder. 
- Maybe upload to cheap storage somewhere.
- Update User Disk Space usage on upload

**Model Deletion** (GET /api/delete/:id)
- Should be a DELETE request. 
- Not handled really gracefully. I should really do this async with ajax, but can we be bothered? Jade templating is quite allright for this scale. 

**Model Editing** (PUT /api/models/:id)
- Rename model, set permissions
- Maybe out of scope of the mvp

**Model Viewing** 
- Implement a graceful route to the speckle viewer that allows for auth strategies later on

#### 3. Documentation

Quite important. Things that need doing:
- getting started guide
- examples files
- usage scenarios
- file format doc (so we can allow for exports from other param software)
