export const mockReports = [
    {
        id: "id1",
        feature_id: "fid1",
        report_model_id: "12345678-1234-5678-1234-567812345678",
        created_at: "2021-01-22T13:33:00+00:00",
        updated_by: "foo",
        created_by: "foo",
        updated_at: "2021-01-23T13:34:00+00:00",
        custom_field_values: {
            commentaire: "foo",
            date: "2021-01-22",
            category: "category1",
            file: "data:image/png;name=Screenshot%202021-05-12%20at%2016-44-44%20Datafeeder.png;base64,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"
        },
    },
    {
        id: "id2",
        feature_id: "fid2",
        report_model_id: "12345678-1234-5678-1234-567812345679",
        created_at: "2021-02-15T13:33:00+00:00",
        updated_by: "bar",
        created_by: "bar",
        updated_at: "2021-02-16T13:34:00+00:00",
        custom_field_values: {
            commentaire: "bah",
        },
    },
];
