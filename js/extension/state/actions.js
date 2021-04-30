export const displayForm = () => {
    return {
        type: 'DISPLAY_FORM'
    };
};

export const fetchSchemas = () => {
    return {
        type: 'FETCH_SCHEMAS'
    };
};

export const loadedSchemas = (payload) => {
    return {
        type: 'LOADED_SCHEMAS',
        payload
    };
};

export const loadError = (error) => {
    return {
        type: 'LOAD_ERROR',
        error
    };
};

export const selectSchema = (payload) => {
    return {
        type: 'SELECT_SCHEMA',
        payload
    };
};

export const postReport = (payload) => {
    console.log("post report action")
    return {
        type: 'POST_REPORT',
        payload
    };
};

export const getReport = (layer_id, feature_id) => {
    return {
        type: 'GET_REPORTS',
        layer_id,
        feature_id
    };
};
