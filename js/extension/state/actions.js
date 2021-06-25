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
