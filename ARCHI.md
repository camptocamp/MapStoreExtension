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

- report_model
   - layer (string)
   - custom_fields_model (JSON)
- report
   - model (FK report_model)
   - layer (string)
   - feature_id (string)
   - updated_by (string)
   - update_at (datetime)
   - custom_fields_values (JSON)

## URL map

### Admin part

- /admin/report_models/schema GET : returns JSON schema of templates
- /admin/report_models GET : returns list of templates
- /admin/report_models POST : add new template
- /admin/report_models/{id} GET : returns template properties
- /admin/report_models/{id} PATCH : update existing template
- /admin/report_models/{id} DELETE : delete existing template 

### User part

- /reports/schema GET : returns JSON schema of reports
- /reports?feature_id={feature_id} GET : returns list of reports for a feature
- /reports POST : add new report on feature
- /reports/{id} GET : returns report properties
- /reports/{id} PATCH : update existing report
- /reports/{id} DELETE : delete existing report

### TJS part

- /reports/export.csv?report_model={report_model} GET : returns list of reports as CSV

# Frontend

## Dependencies

- ReactJS
- react-jsonschema-form: https://react-jsonschema-form.readthedocs.io/en/latest/

## Common part

These classes could be shared for use in other projects.

### Form base class

Request JSON schema and feature properties
Render forms, send POST, PATCH and DELETE requests.
Properties
- schema or URL to schema
- list of routes for GET / PUT / PATCH / DELETE actions

### Table base class

Request collections and render table view.
Properties
- route to collection
- list of fields (name, sortable, etc) or method to extract it from collection or other view

### Resource type base class

Include a table and form widgets and manage interaction between table and form.
Properties
- Form class (and/or form overrides/properties)
- Table class (and/or table overrides/properties)
