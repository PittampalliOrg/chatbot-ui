/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createDriveFromDiscriminatorValue, type Drive } from '../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../models/oDataErrors/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the drive property of the microsoft.graph.user entity.
 */
export interface DriveRequestBuilder extends BaseRequestBuilder<DriveRequestBuilder> {
    /**
     * Retrieve the properties and relationships of a drive resource. A drive is the top-level container for a file system, such as OneDrive or SharePoint document libraries.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<Drive>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/drive-get?view=graph-rest-beta|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<DriveRequestBuilderGetQueryParameters> | undefined) : Promise<Drive | undefined>;
    /**
     * Retrieve the properties and relationships of a drive resource. A drive is the top-level container for a file system, such as OneDrive or SharePoint document libraries.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<DriveRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
/**
 * Retrieve the properties and relationships of a drive resource. A drive is the top-level container for a file system, such as OneDrive or SharePoint document libraries.
 */
export interface DriveRequestBuilderGetQueryParameters {
    /**
     * Expand related entities
     */
    expand?: string[];
    /**
     * Select properties to be returned
     */
    select?: string[];
}
/**
 * Uri template for the request builder.
 */
export const DriveRequestBuilderUriTemplate = "{+baseurl}/me/drive{?%24expand,%24select}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const DriveRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "expand": "%24expand",
    "select": "%24select",
};
/**
 * Metadata for all the requests in the request builder.
 */
export const DriveRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: DriveRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createDriveFromDiscriminatorValue,
        queryParametersMapper: DriveRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
