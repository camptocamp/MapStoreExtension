import Rx from "rxjs";
import axios from "@mapstore/libs/ajax";
import { mockReports } from "./mockReports";
import { mockSchemas } from "./mockSchemas";

const REPORTS = "/reports";
const SCHEMAS = "/jsonschemas";

const MOCKS = {
    [REPORTS]: mockReports,
    [SCHEMAS]: mockSchemas,
};
MOCKS[REPORTS + "-post"] = {};

function request(url, options) {
    options = options || {};

    // Use mock if asked in query params
    if (new URLSearchParams(window.location.search).has("usemocks")) {
        return Rx.Observable.of(
            options.data ? MOCKS[url + "-post"] : MOCKS[url]
        );
    }

    const httpReportsProd = axios.create({
        baseURL: "../featurereports/reports",
        headers: {
            "Content-type": "application/json",
        },
    });

    // use axios in prod, fetch in dev
    let fetchAPI;
    if (process.env.NODE_ENV === "production") {
        const endpoint = `../featurereports${url}`;

        let params = {};
        if (options.layerId && options.featureId) {
            params = {
                "feature_id": options.featureId,
                "layer_id": options.layerId,
            };
        }

        fetchAPI = options.formData ?
            axios
                .create({
                    baseURL: endpoint,
                    headers: {
                        "Content-type": "application/json",
                    },
                })
                .post("", options.formData)
                .catch((error) => {
                    console.error("Error:", error);
                })
            : axios.get(endpoint, {params});

        fetchAPI = fetchAPI.then((response) => response.data);
    } else {
        let fetchOptions = {};
        let fullurl = new URL(`http://localhost:8080${url}`);

        if (options.formData) {
            fetchOptions = {
                method: "POST", // or 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(options.formData),
            }
        }
        if (options.layerId && options.featureId) {
            fullurl.searchParams.append("feature_id", options.featureId);
            fullurl.searchParams.append("layer_id", options.layerId);
            fetchOptions = {
                method: "GET"
            }
        }
        fetchAPI = fetch(
            fullurl,
            fetchOptions
        ).then((response) => response.json());
    }

    if (options.layerId && options.featureId) {
        // getReports
        fetchAPI = fetchAPI.then((reports) => reports.map((report) => JSON.parse(report)));
    }

    return Rx.Observable.fromPromise(fetchAPI);
}

export const reportService = {
    getReports: (featureId, layerId) => request(REPORTS, {featureId, layerId}),
    getSchemas: () => request(SCHEMAS),
    postReport: (formData) => request(REPORTS, {formData}),
};

export const filterData = (report) => {
    const { created_at, updated_at, created_by, updated_by, ...result } =
        report;
    return { creationInfos :  { created_at, updated_at, created_by, updated_by },
             result
            };
};
