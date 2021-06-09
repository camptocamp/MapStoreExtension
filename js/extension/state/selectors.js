import { currentResponseSelector } from '@mapstore/selectors/mapInfo';

const schemaSelector = state => state.reportExtension && state.reportExtension.schemas || [];

export const schemasByLayersSelector = state => {
    const reportSchemas = schemaSelector(state);
    const currentResponse = currentResponseSelector(state);
    const layer_id = currentResponse && currentResponse.layer && currentResponse.layer.name;
    return (reportSchemas.filter( schema => schema.layer_id === layer_id));
};
