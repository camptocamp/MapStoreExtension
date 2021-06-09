import React from "react";

export const fieldTemplate = function (props) {
    const {
        id,
        help,
        required,
        description,
        errors,
        children,
        uiSchema,
        formData,
        schema,
    } = props;
    let { classNames } = props;
    const fileUpload = schema.format === "data-url";

    if (fileUpload) {
        classNames += " file-upload";
    }

    const display = !(uiSchema["ui:widget"] &&  uiSchema["ui:widget"]==="hidden");

    return (
        <div> {display &&
            <div className={classNames}>
                <label htmlFor={id}>
                    {schema.title}
                    {required ? "*" : null}
                </label>
                {fileUpload && formData && (
                    <div>
                        <a
                            href={formData}
                            download={"document." + getExtension(formData)}
                        >
                            Document téléversé (
                            {getExtension(formData).toUpperCase()} -{" "}
                            {getFileSize(formData)}Kb)
                        </a>
                    </div>
                )}
                {description}
                {children}
                {errors}
                {help}
            </div>
        } </div>
    );
};

function getExtension(dataURI) {
    return dataURI.split(";")[0].split(":")[1].split("/")[1];
}

function getFileSize(src) {
    // from https://stackoverflow.com/a/47852494
    let base64Length = src.length - (src.indexOf(",") + 1);
    let padding =
        src.charAt(src.length - 2) === "="
            ? 2
            : src.charAt(src.length - 1) === "="
            ? 1
            : 0;
    let fileSize = base64Length * 0.75 - padding;
    return (fileSize / 1000).toFixed(1);
}
