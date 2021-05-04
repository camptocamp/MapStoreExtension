import React from "react";
import Select from 'react-select';
import { Row, Col, Collapse, Button, Glyphicon, Panel } from 'react-bootstrap';
import Form from "@rjsf/core";
import PropTypes from 'prop-types';
import { postReport } from "../state/actions";

import InfoButton from "@mapstore/components/buttons/InfoButton";

const log = (type) => console.log.bind(console, type);

const defaultSchema = {
    id: null,
    name:'',
    JSONSchema: {},
    UISchema: {},
    formData: {feature_id:''}
}

class FeatureReports extends React.Component {
    static propTypes = {
        feature: PropTypes.object,
        schemasByLayers: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedSchema: defaultSchema,
            editReport: false,
            feature_id: props.feature.id
        };
    }

    schemaOption(schema) {
        return {label: schema.name, value: schema};
    }

    selectSchema(schema) {
        if (schema.formData) {
            schema.formData.feature_id = this.state.feature_id;
        } else {
            schema.formData = {"feature_id" : this.state.feature_id};
        };
        this.setState({
            selectedSchema: schema
        });
    }

    toggleEditReport(toggled) {
        this.setState({editReport: toggled});
    }

    render() {
        const { selectedSchema, editReport } = this.state;
        const { properties } = this.props.feature;
        const feature_id = this.props.feature.id;

        return (<Panel>
            <Row>
                <Col sm={10}>{feature_id}</Col>
                <Col sm={1}>
                    <InfoButton 
                        glyphicon="info-sign" 
                        text="" 
                        title={"Feature " + feature_id}
                        body={
                            <ul>
                                {Object.keys(properties).map((prop, i) => (
                                    <li>
                                        <strong>{prop}:</strong> {properties[prop]}
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                </Col>
                <Col sm={1}>
                    <Button
                        bsStyle="primary"
                        onClick={() => this.toggleEditReport(!editReport)}
                        aria-controls="edit-report"
                        aria-expanded={editReport}
                    >
                        <Glyphicon glyph="pencil"/>
                    </Button>
                </Col>
            </Row>
            <Collapse in={editReport}>
                <div id="edit-report">
                    <div id="model-select">
                        <p>Modèles de rapport</p>
                        <Select 
                            options={this.props.schemasByLayers.map(schemaByLayer => this.schemaOption(schemaByLayer))}
                            onChange={(e) => {
                                this.selectSchema(e.value);
                            }}
                            value={this.schemaOption(selectedSchema)}
                        />
                    </div>
                    {selectedSchema && 
                        <Form 
                            schema={selectedSchema.JSONSchema}
                            uiSchema={selectedSchema.UISchema}
                            formData={selectedSchema.formData}
                            onChange={log("changed")}
                            onSubmit={this.props.postReport}
                            onError={log("errors")} 
                        />
                    }
                </div>
            </Collapse>
        </Panel>);
    }
}

export default FeatureReports;
