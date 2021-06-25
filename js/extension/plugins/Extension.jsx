import {connect} from "react-redux";
import { name } from '../../../config';
import React from "react";
import { Glyphicon } from 'react-bootstrap';

import ExtensionComponent from "../components/Component";
import { fetchSchemas, loadedSchemas, loadError, displayForm } from "../state/actions";
import reportExtension from "../state/reducers";
import {fetchSchemasEpic, displayFormEpic} from '../state/epics';
import { schemasByLayersSelector } from "../state/selectors";
import { currentFeatureSelector } from '@mapstore/selectors/mapInfo';
import '../assets/style.css';


export const ReportIdentifyViewer = connect(state => ({
    schemas: state.reportExtension && state.reportExtension.schemas,
    display: state.reportExtension && state.reportExtension.display,
    schemasByLayers: schemasByLayersSelector(state),
    selectedSchema: state.reportExtension && state.reportExtension.selectedSchema,
    currentFeatures: currentFeatureSelector(state)
}), {
    fetchSchemas,
    loadedSchemas,
    loadError,
    displayForm
})(ExtensionComponent);

export default {
    name,
    component: ReportIdentifyViewer,
    reducers: {reportExtension},
    epics: {
        fetchSchemasEpic,
        displayFormEpic,
    },
    containers: {
        Toolbar: {
            name: "reportExtension",
            position: 10,
            icon: <Glyphicon glyph="list-alt" />,
            doNotHide: true,
            action: () => {
                return {
                    type: 'DISPLAY_FORM'
                };
            },
            selector: (state) => ({
                bsStyle: state.reportExtension && state.reportExtension.display ? "success" : "primary",
                active: !!(state.reportExtension && state.reportExtension.display)
            }),
            priority: 1
        }
    }
};
