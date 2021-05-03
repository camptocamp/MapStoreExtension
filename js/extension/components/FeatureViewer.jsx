import React from 'react';
import PropTypes from 'prop-types';

class FeatureViewer extends React.Component {
    static propTypes = {
        feature: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {

        const {type, id, properties, geometry, geometry_name, bbox} = this.props.feature;

        return (
            <div>
                
                <p>
                    Properties : 
                        <pre>
                            {Object.keys(properties).map((prop, i) => 
                                <div>{prop} : {properties[prop]}</div>
                            )}
                        </pre>
                </p>
                <p>
                    Geometry :
                        <pre>{JSON.stringify({"geometry_name" : geometry_name, "geometry" : geometry}, null, 2)}</pre>
                </p>
                <p>
                    Bounding box : 
                        <pre>{JSON.stringify(bbox, null, 2)}</pre> 
                </p>
                
            </div>);
    }
}
 
export default FeatureViewer;