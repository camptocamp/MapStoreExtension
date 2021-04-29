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
    // case 'POST_REPORT': 
    // console.log("post report reducer");
    // console.log(action.payload);

    // // use axios in prod, fetch in dev
    // const postAPI = fetch('https://georchestra.mydomain.org/mapstore-reports/reports', {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Authorization': 'Basic '+btoa('testadmin:testadmin'),
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(action.payload.formData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    //     return {
    //         ...
    //         state,
    //         formData: action.payload
    //     };
    default:
        return state;
    }
}

export default reportExtension;
