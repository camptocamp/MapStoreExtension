import { currentResponseSelector } from '@mapstore/selectors/mapInfo';
import { createSelector } from "reselect";

const schemaSelector = state => state.reportExtension && state.reportExtension.schemas || [];

export const schemasByLayersSelector = createSelector(
    schemaSelector,
    currentResponseSelector,
    (schemas) => schemas
    // schemas.filter(schema => {
    //     return response ?
    //         schema.layer_id === response.layer.id :
    //         false;
    // })
);
