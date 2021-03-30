import React, { useEffect } from "react";
import FeatureReports from "./FeatureReports";

const Extension = ({ display, schemasByLayers, currentFeatures, fetchSchemas }) => {
    useEffect(() => {
        fetchSchemas();
    }, []);

    return (
        <div>
            {display &&
        <div id="report-extension">
            {currentFeatures &&
            currentFeatures.map(feature => {
                return <FeatureReports feature={feature} schemasByLayers={schemasByLayers}/>;
            })
            }
        </div>}
        </div>);
};

export default Extension;
