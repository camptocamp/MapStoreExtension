import { loadedSchemas, loadError } from "./actions";
import { layersSelector } from 'mapstore2/web/client/selectors/layers';
import * as MapInfoUtils from 'mapstore2/web/client/utils/MapInfoUtils';
import { ReportIdentifyViewer } from '../plugins/Extension.jsx';
import { updateNode } from 'mapstore2/web/client/actions/layers';
import { updateFeatureInfoClickPoint } from "@mapstore/actions/mapInfo";
import Rx from "rxjs";

// import { mockSchemas } from "../plugins/mockSchemas";
import '../assets/style.css';
import axios from '@mapstore/libs/ajax';


export const fetchSchemasEpic = (action$) => action$.ofType('FETCH_SCHEMAS').switchMap(() => {
    // set custom viewer to inject extension component into Identify
    MapInfoUtils.setViewer('reportViewer', ReportIdentifyViewer);

    // TODO: remove mocks and use API response
    // return Rx.Observable.of(loadedSchemas(mockSchemas));

    // use axios in prod, fetch in dev
    // TODO: replace 'reports' API (used to test ping) by 'schemas' API once it exists
    const fetchAPI = process.env.NODE_ENV === 'production' ?
        axios.get('../mapstore-reports/jsonschemas')
            .then(response => response.data) :
        fetch('https://georchestra.mydomain.org/mapstore-reports/jsonschemas')
            .then(response => response.json());

    return Rx.Observable.fromPromise(fetchAPI)
        .switchMap((response) => {
            console.log('Fetched schemas: ', response);
            const responseList = Object.values(response);
            return Rx.Observable.of(loadedSchemas(responseList));
        })
        .catch(e => Rx.Observable.of(loadError(e.message)));
});

export const displayFormEpic = (action$, store) => action$.ofType('DISPLAY_FORM').mergeMap(() => {
    // no featureInfo = identify mode
    const display = store.getState().reportExtension.display;
    const featureInfo = (display) ? {
        format: "PROPERTIES",
        viewer: {
            type: 'reportViewer'
        }
    } : undefined;

    const layers = layersSelector(store.getState());
    const viewerObservable = Rx.Observable.of(
        ...layers.filter(layer => layer.type === 'wms').map(layer =>
            updateNode(
                layer.id,
                'layers',
                { featureInfo: featureInfo }
            )
        )
    );

    // if featureInfo or report is already displayed, force viewer refresh by simulating click
    const clickPoint = store.getState().mapInfo.clickPoint;
    if (clickPoint) {
        return Rx.Observable.merge(
            viewerObservable,
            Rx.Observable.of(updateFeatureInfoClickPoint(clickPoint))
        );
    }

    return viewerObservable;

});

const httpReportsProd = axios.create({
    baseURL: '../mapstore-reports/reports',
    headers: {
      'Content-type': 'application/json',
    },
  });


export const postReportEpic = (action$ ) => action$.ofType('POST_REPORT').switchMap((action) => {

    const data = action.payload.formData;
    console.log("post report epic, data : ", data);

    // use axios in prod, fetch in dev
    const postAPI = process.env.NODE_ENV === 'production' ?
    httpReportsProd.post('', data,)
        .then(response => response.data) 
        .then(response => console.log(response))
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        }) :
    fetch('https://georchestra.mydomain.org/mapstore-reports/reports', {
      method: 'POST', // or 'PUT',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return Rx.Observable.fromPromise(postAPI)
        .switchMap((response) => {
            console.log('Posted report: ', response);
            const responseList = Object.values(response);
            return Rx.Observable.of(loadedSchemas(responseList));
        })
        .catch(e => Rx.Observable.of(loadError(e.message)));
});

export default { fetchSchemasEpic, displayFormEpic, postReportEpic };
