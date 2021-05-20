import { currentResponseSelector } from '@mapstore/selectors/mapInfo';
import { createSelector } from "reselect";

const schemaSelector = state => state.reportExtension && state.reportExtension.schemas || [];

export const schemasByLayersSelector = state => {
    const reportSchemas = schemaSelector(state);
    const currentResponse = currentResponseSelector(state);
    const layer_id = currentResponse && currentResponse.layer && currentResponse.layer.id;
    return reportSchemas;
    //return (reportSchemas.filter( schema => schema.layer_id === layer_id))
};
