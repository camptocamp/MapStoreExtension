# MapStore extension for feature reports project
 
This repo is a fork of [MapStoreExtension](https://github.com/geosolutions-it/MapStoreExtension).

It contains the client side of the feature reports project.

Thanks to it a user can consult, create or edit reports on each feature of a layer (depending on his rights on the layer).

The reports templates ("report models") are created and edited throught the admin part ([camptocamp/drealcorse-reports](https://github.com/camptocamp/drealcorse-reports)). Each template is applicable to all features of the layer it has been created for.



## Build .zip

Clone the repository with the --recursive option to automatically clone submodules.

`git clone --recursive https://github.com/camptocamp/featurereports-mapstoreextension`

Install NodeJS >= 12.16.1 , if needed, from [here](https://nodejs.org/en/download/releases/).


Install the app and then build the .zip archive to be imported in MapStore :

`npm install`

`npm run ext:build`
 
 This will create a `ReportExtension.zip` zip in `dist` directory.
 
## Add the extension to your MapStore instance 
 
 - from UI : import `ReportExtension.zip` throught a context creator/editor (this will automatically create the `pluginsConfig.json.patch` file which effects are documented below)
   
 or 
 - copy zip content in `georchestra_datadir/mapstore/dist/extensions/ReportExtension/`
 - create/edit the following files in `georchestra_datadir/mapstore` :
      - `extensions.json` (to reference extensions) : 
        `{
          "ReportExtension": {
            "bundle":"dist/extensions/ReportExtension/index.js",
            "translations":"dist/extensions/ReportExtension/translations"
          }
        }`
      - `pluginsConfig.json.patch` (optionnal, see below) :
        `[
           {
             "op":"add",
             "path":"/plugins/-",
             "value": {
               "name":"ReportExtension",
               "dependencies":["Toolbar"],
               "extension":true
             }
           }
         ]`

## `pluginsConfig.json.patch` file 

This file determines how the extension will be handled by MapStore UI.

If present as created when imported from the UI (above content) :
- any extension added to MapStore will be present in the default context and available for all other contexts.
- while creating/editing a context any mapstore admin user can accidentally remove the extension, which is then totally removed from the MapStore instance, i.e., not available for any context anymore.

If present with `"extension":false` :
- the extension will be considered as a plugin and will be present in the default context and available for all other contexts.
- it won't be possible to accidentally remove the extension, it won't be possible to remove it directly from the UI (entirely removing the extension is needed to reload it/load an extension with the same name.

If absent :
- the extension will be present in the default context and not available for any other contexts.

## Important warning

As state-of-the-art MapStore doesn't enable extensions to register a viewer as a CustomViewer, we tweaked it with [this commit](https://github.com/camptocamp/MapStore2/commit/fcdea4f0eab87942a70a17b8eb8933d2a04584d1).

As Mapstore is a submodule of both MapStoreExtension and mapstore2-georchestra, we had to create a custom image for mapstore2-georchestra, and the extension has to be built with that modification.

That needs to be kept in mind while updating the project.




