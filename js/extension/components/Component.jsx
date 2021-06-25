import React, { useEffect } from "react";
import FeatureReports from "./FeatureReports";

const Extension = ({ display, schemasByLayers, currentFeatures, fetchSchemas, postReport }) => {
    useEffect(() => {
        fetchSchemas();
    }, []);

    return (
        
        <div>
            {display && 
        <div id="report-extension">
            {currentFeatures &&
            currentFeatures.map(feature => {
                return <FeatureReports key={feature.id} feature={feature} schemasByLayers={schemasByLayers} postReport={postReport} />;
            })
            }
        </div>}
        </div>);
};

export default Extension;
