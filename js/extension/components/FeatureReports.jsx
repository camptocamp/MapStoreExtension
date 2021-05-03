import React from "react";
import Select from 'react-select';
import { Row, Col, Collapse, Button, Glyphicon, Panel } from 'react-bootstrap';
import Form from "@rjsf/core";
import PropTypes from 'prop-types';
import FeatureViewer from './FeatureViewer';

import InfoButton from "@mapstore/components/buttons/InfoButton";

const log = (type) => console.log.bind(console, type);

class FeatureReports extends React.Component {
    static propTypes = {
        feature: PropTypes.object,
        schemasByLayers: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedSchema: undefined,
            editReport: false
        };
    }

    render() {
        const { selectedSchema, editReport } = this.state;

        return (<Panel>
            <Row>
                <Col sm={10}>{this.props.feature.id}</Col>
                <Col sm={1}>
                    <InfoButton 
                        glyphicon="info-sign" 
                        text="" 
                        title={"Feature " + this.props.feature.id}
                        body={
                            <FeatureViewer feature={this.props.feature}/>
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
                        <Select options={
                            this.props.schemasByLayers.map(schemaByLayer => {
                                const option = {
                                    value: schemaByLayer,
                                    label: schemaByLayer.title
                                };
                                return option;
                            }
                            )}
                        onChange={(e) => {
                            this.selectSchema(e.value);
                        }}
                        />
                    </div>
                    {selectedSchema && <Form schema={selectedSchema}
                        onChange={log("changed")}
                        onSubmit={log("submitted")}
                        onError={log("errors")} />
                    }
                </div>
            </Collapse>
        </Panel>);
    }

    featureToString(feature) {
        return JSON.stringify({feature}, null, "4");
    }

    selectSchema(schema) {
        this.setState({selectedSchema: schema});
    }

    toggleEditReport(toggled) {
        this.setState({editReport: toggled});
    }
}

export default FeatureReports;
