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
        baseURL: "../mapstore-reports/reports",
        headers: {
            "Content-type": "application/json",
        },
    });

    // use axios in prod, fetch in dev
    let fetchAPI;
    if (process.env.NODE_ENV === "production") {
        const endpoint = `../mapstore-reports${url}`;
        fetchAPI = options.data
            ? axios
                  .create({
                      baseURL: endpoint,
                      headers: {
                          "Content-type": "application/json",
                      },
                  })
                  .post("", options.data)
                  .catch((error) => {
                      console.error("Error:", error);
                  })
            : axios.get(endpoint);
        fetchAPI = fetchAPI.then((response) => response.data);
    } else {
        const fetchOptions = options.data
            ? {
                  method: "POST", // or 'PUT',
                  credentials: "include",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
              }
            : {};
        fetchAPI = fetch(
            `https://georchestra.mydomain.org/mapstore-reports${url}`,
            fetchOptions
        ).then((response) => response.json());
    }

    return Rx.Observable.fromPromise(fetchAPI);
}

export const reportService = {
    getReports: (featureId) => request(REPORTS),
    getSchemas: () => request(SCHEMAS),
    postReport: (data) => request(REPORTS, { data }),
};

export const filterData = (report) => {
    const { created_at, updated_at, created_by, updated_by, ...result } =
        report;
    return result;
};
