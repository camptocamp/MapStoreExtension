function reportExtension(state = { schemas: [{}], selectedSchema: undefined, display: false, error: '' }, action) {
    switch (action.type) {
    case 'LOADED_SCHEMAS':
        return {
            ...
            state,
            schemas: action.payload
        };
    case 'LOAD_ERROR':
        return {
            ...
            state,
            error: action.error
        };
    case 'DISPLAY_FORM':
        return {
            ...
            state,
            display: !state.display
        };
    case 'SELECT_SCHEMA':
        return {
            ...
            state,
            selectedSchema: action.payload.value
        };
    default:
        return state;
    }
}

export default reportExtension;
