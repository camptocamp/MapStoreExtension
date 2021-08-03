from https://docs.google.com/document/d/1IoPdFAkD6tVkzB2T6L4SYy4xS1Z7eDcvocA5_D4Zlzw/edit#

# Frontend

## User side (MapStore Extension, reports)


### Dependencies

- ReactJS
- react-redux
- react-jsonschema-form: https://react-jsonschema-form.readthedocs.io/en/latest/
- react-select
- react-bootstrap
- html2pdf.js
- rxjs

### Common part

Much if not all of the project could be reused, but beware : we register a CustomViewer from the extension, and this is not native yet (see below).

# Important warning

As state-of-the-art MapStore doesn't enable extensions to register a viewer as a CustomViewer, we tweaked it with [this commit](https://github.com/camptocamp/MapStore2/commit/fcdea4f0eab87942a70a17b8eb8933d2a04584d1).

As Mapstore is a submodule of both MapStoreExtension and mapstore2-georchestra, we had to create a custom image for mapstore2-georchestra, and the extension as to be built with that modification.
