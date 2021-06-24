import InfoButton from "@mapstore/components/buttons/InfoButton";
import Form from "@rjsf/core";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Collapse, Glyphicon, Panel, Row } from "react-bootstrap";
import Select from "react-select";
import { default as html2pdf } from "html2pdf.js";
import { reportService, filterData } from "../plugins/reportService";
import { fieldTemplate } from "../plugins/formFieldTemplate";

const log = (type) => console.log.bind(console, type);

const defaultSchema = {
    id: null,
    name: "",
    JSONSchema: {},
    UISchema: {},
    formData: { feature_id: "" },
};

class FeatureReports extends React.Component {
    static propTypes = {
        feature: PropTypes.object,
        schemasByLayers: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedSchema: defaultSchema,
            editReport: false,
            feature_id: props.feature.id,
            reports: [],
            printing: false,
            layer_id: ""
        };
        this.form = React.createRef();
    }

    componentDidMount() {
        this.updateState();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.feature.id !== prevProps.feature.id) {
            this.updateState();
        }
        if (this.state.layer_id !== prevState.layer_id) {
            this.getReports();
        }
    } 
      
    updateState() {
        const layer_id = (this.props.schemasByLayers && this.props.schemasByLayers.length != 0 && this.props.schemasByLayers[0].layer_id) ?
            this.props.schemasByLayers[0].layer_id:
            undefined;

        this.setState({feature_id: this.props.feature.id, layer_id : layer_id}); 
    }

    getReports() {
        this.subscription = reportService
            .getReports(this.state.feature_id, this.state.layer_id)
            .subscribe((reports) => this.setState({ reports }));
    }
      


    schemaOption(schema) {
        return { label: schema.name, value: schema };
    }

    selectSchema(schema) {
        if (schema.formData) {
            schema.formData.feature_id = this.state.feature_id;
        } else {
            schema.formData = { feature_id: this.state.feature_id };
        }
        this.setState({
            selectedSchema: schema,
        });
    }

    toggleEditReport(toggled, printing = false) {
        this.setState({ editReport: toggled, printing });
    }

    stateForReport(report) {
        return {
            editReport: true,
            feature_id: report.feature_id,
            selectedSchema: {
                ...this.props.schemasByLayers.filter(
                    (s) => s.id === report.report_model_id
                )[0],
                formData: filterData(report),
            },
        };
    }

    showReport(report) {
        this.setState(this.stateForReport(report));
    }

    printReport(report) {
        const suffix = new Date().toLocaleDateString().replaceAll("/", "-");
        const options = {
            margin: 5,
            filename: `drealcorse_rapport_${suffix}.pdf`,
        };
        this.setState(
            {
                ...this.stateForReport(report),
                printing: true,
            },
            () =>
                html2pdf()
                    .set(options)
                    .from(this.form.current)
                    .save()
                    .then(() => this.toggleEditReport(false, false))
        );
    }

    postReport(formData) {
        this.setState({ editReport: false });

        this.subscription = reportService
            .postReport(formData)
            .subscribe(() =>  this.getReports() );
    }

    componentWillUnmount() {
        this.subscription?.unsubscribe();
    }

    render() {
        const { selectedSchema, editReport, reports } = this.state;
        const feature_id = this.props.feature.id;

        const reportsByModel = this.props.schemasByLayers.reduce(
            (map, schema) => {
                const filtered = reports.filter(
                    (r) => r.report_model_id === schema.id
                );
                if (filtered.length > 0) {
                    map[schema.title] = filtered;
                }
                return map;
            },
            {}
        );

        return (
            <Panel>
                <Row>
                    <Col sm={10}>{feature_id}</Col>
                    <Col sm={1}>
                        <InfoButton
                            glyphicon="info-sign"
                            text=""
                            title={"Feature " + feature_id}
                            body={this.renderFeaturePropertiesList()}
                        />
                    </Col>
                    <Col sm={1}>
                        <Button
                            bsStyle="primary"
                            onClick={() => this.toggleEditReport(!editReport)}
                            aria-controls="edit-report"
                            aria-expanded={editReport}
                        >
                            <Glyphicon glyph="pencil" />
                        </Button>
                    </Col>
                </Row>
                <Collapse in={editReport}>
                    <div id="edit-report">
                        <div id="model-select">
                            <p>Modèles de rapport</p>
                            <Select
                                options={this.props.schemasByLayers.map(
                                    (schemaByLayer) =>
                                        this.schemaOption(schemaByLayer)
                                )}
                                onChange={(e) => {
                                    this.selectSchema(e.value);
                                }}
                                value={this.schemaOption(selectedSchema)}
                            />
                        </div>
                        <div
                            class="report-form"
                            ref={this.form}
                            className={
                                this.state.printing ? "report-print" : ""
                            }
                        >
                            {selectedSchema && (
                                <Form
                                    schema={selectedSchema.JSONSchema}
                                    uiSchema={selectedSchema.UISchema}
                                    formData={selectedSchema.formData}
                                    onChange={log("changed")}
                                    onSubmit={({formData}, e) => this.postReport(formData)}
                                    onError={log("errors")}
                                    FieldTemplate={fieldTemplate}
                                >
                                  {selectedSchema.readOnly && <div></div>} 
                                </Form>
                            )}
                        </div>
                    </div>
                </Collapse>
                {Object.keys(reportsByModel).map((report) => [
                    <h5>{report}</h5>,
                    <ul>{this.renderReportsList(reportsByModel[report])}</ul>,
                ])}
            </Panel>
        );
    }

    renderFeaturePropertiesList() {
        const { properties } = this.props.feature;
        return (
            <ul>
                {Object.keys(properties).map((prop, i) => (
                    <li>
                        <strong>{prop}:</strong> {properties[prop]}
                    </li>
                ))}
            </ul>
        );
    }

    renderReportsList(reports) {
        console.log(reports);
        return reports.map((r) => (
            <li key={r.id}>
                <button class="btn btn-link" onClick={() => this.showReport(r)}>
                    {this.formatDate(r.created_at)}
                        {r.created_by}
                </button>
                <button
                    class="btn btn-link"
                    onClick={() => this.printReport(r)}
                >
                    PDF
                </button>
            </li>
        ));
    }

    formatDate(str) {
        return new Intl.DateTimeFormat("fr-FR").format(new Date(str));
    }
}

export default FeatureReports;
