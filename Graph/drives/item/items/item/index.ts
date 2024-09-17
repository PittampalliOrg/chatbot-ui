/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createDriveItemFromDiscriminatorValue, type DriveItem } from '../../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../../models/oDataErrors/index';
// @ts-ignore
import { CreateLinkRequestBuilderRequestsMetadata, type CreateLinkRequestBuilder } from './createLink/index';
// @ts-ignore
import { PreviewRequestBuilderRequestsMetadata, type PreviewRequestBuilder } from './preview/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the items property of the microsoft.graph.drive entity.
 */
export interface DriveItemItemRequestBuilder extends BaseRequestBuilder<DriveItemItemRequestBuilder> {
    /**
     * Provides operations to call the createLink method.
     */
    get createLink(): CreateLinkRequestBuilder;
    /**
     * Provides operations to call the preview method.
     */
    get preview(): PreviewRequestBuilder;
    /**
     * All items contained in the drive. Read-only. Nullable.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<DriveItem>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     */
     get(requestConfiguration?: RequestConfiguration<DriveItemItemRequestBuilderGetQueryParameters> | undefined) : Promise<DriveItem | undefined>;
    /**
     * All items contained in the drive. Read-only. Nullable.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<DriveItemItemRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
/**
 * All items contained in the drive. Read-only. Nullable.
 */
export interface DriveItemItemRequestBuilderGetQueryParameters {
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
export const DriveItemItemRequestBuilderUriTemplate = "{+baseurl}/drives/{drive%2Did}/items/{driveItem%2Did}{?%24expand,%24select}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const DriveItemItemRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "expand": "%24expand",
    "select": "%24select",
};
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const DriveItemItemRequestBuilderNavigationMetadata: Record<Exclude<keyof DriveItemItemRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    createLink: {
        requestsMetadata: CreateLinkRequestBuilderRequestsMetadata,
    },
    preview: {
        requestsMetadata: PreviewRequestBuilderRequestsMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const DriveItemItemRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: DriveItemItemRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createDriveItemFromDiscriminatorValue,
        queryParametersMapper: DriveItemItemRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
