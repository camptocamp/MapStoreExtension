import Rx from "rxjs";
import { mockReports } from "./mockReports";

export const reportService = {
  getReports: (featureId) => {
      return Rx.Observable.of(mockReports)
  }
};