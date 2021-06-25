import { loadedSchemas, loadError } from "./actions";
import { layersSelector } from "mapstore2/web/client/selectors/layers";
import * as MapInfoUtils from "mapstore2/web/client/utils/MapInfoUtils";
import { ReportIdentifyViewer } from "../plugins/Extension.jsx";
import { updateNode } from "mapstore2/web/client/actions/layers";
import { updateFeatureInfoClickPoint } from "@mapstore/actions/mapInfo";
import Rx from "rxjs";

import "../assets/style.css";
import { reportService } from "../plugins/reportService";

export const fetchSchemasEpic = (action$) =>
    action$.ofType("FETCH_SCHEMAS").switchMap(() => {
        // set custom viewer to inject extension component into Identify
        MapInfoUtils.setViewer("reportViewer", ReportIdentifyViewer);

        return reportService
            .getSchemas()
            .switchMap((response) =>
                Rx.Observable.of(loadedSchemas(Object.values(response)))
            )
            .catch((e) => Rx.Observable.of(loadError(e.message)));
    });

export const displayFormEpic = (action$, store) =>
    action$.ofType("DISPLAY_FORM").mergeMap(() => {
        // no featureInfo = identify mode
        const display = store.getState().reportExtension.display;
        const featureInfo = display
            ? {
                  format: "PROPERTIES",
                  viewer: {
                      type: "reportViewer",
                  },
              }
            : undefined;

        const layers = layersSelector(store.getState());
        const viewerObservable = Rx.Observable.of(
            ...layers
                .filter((layer) => layer.type === "wms")
                .map((layer) =>
                    updateNode(layer.id, "layers", { featureInfo: featureInfo })
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

export default { fetchSchemasEpic, displayFormEpic};
