from https://docs.google.com/document/d/1IoPdFAkD6tVkzB2T6L4SYy4xS1Z7eDcvocA5_D4Zlzw/edit#

# API REST (backend HTTP)

## Dependencies

- Framework Web : Pyramid
- Framework API REST : Cornice
- Deserialisation / validation :
  - Colander
     - SQLAlchemy extension: https://colanderalchemy.readthedocs.io/en/latest/
  - Marshmallow
    - React-JSONSchema-Form Extension: https://github.com/fuhrysteve/marshmallow-jsonschema#react-jsonschema-form-extension
    - SQLAlchemy extension: https://marshmallow-sqlalchemy.readthedocs.io/en/latest/

## Ressources types

- report
   - model (FK report_model)

- report_model
   - id (UUID)
   - name (string)
   - title (string)
   - layer_id (string)
   - feature_id (string)
   - created_by (string)
   - created_at (datetime)
   - updated_by (string)
   - updated_at (datetime)
   - custom_fields (list of report_model_custom_field)

- report_model_custom_field
   - id (UUID)
   - report_model_id (FK report_model)
   - index (int)
   - name (string)
   - title (string)
   - type (in (boolean, date, enum, file, number, string))
   - enum (opt, array[string])
   - required (bool)

## URL map

### Admin part

- /mapstore-reports/layers : returns layers on which the user has admin rights
- /mapstore-reports/jsonschemas GET : returns JSON schema of templates
- /mapstore-reports/report_models GET : returns list of templates
- /mapstore-reports/report_models POST : add new template
- /mapstore-reports/report_models/{id} GET : returns template properties
- /mapstore-reports/report_models/{id} PUT : update existing template
- /mapstore-reports/report_models/{id} DELETE : delete existing template 

### User part

- /reports/schema GET : returns JSON schema of reports
- /reports?feature_id={feature_id}&layer_id={layer_id} GET : returns list of reports for a feature
- /reports POST : add new report on feature / update existing report
- /reports/{id} GET : returns report properties (not used from mapstore extension)
- /reports/{id} DELETE : delete existing report (functional, also not used from mapstore extension)

### TJS part

- ?

# Frontend


## Admin side (report models)
"html2pdf.js": "^0.9.3",
        "mapstore2": "file:MapStore2"

### Dependencies

- ReactJS
- react-dom
- react-icons
- react-select
- react-tagsinput
- axios
- bootstrap
- react-bootstrap-table-next


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