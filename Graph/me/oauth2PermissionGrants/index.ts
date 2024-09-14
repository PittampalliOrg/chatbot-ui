/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createOAuth2PermissionGrantCollectionResponseFromDiscriminatorValue, type OAuth2PermissionGrantCollectionResponse } from '../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../models/oDataErrors/index';
// @ts-ignore
import { CountRequestBuilderRequestsMetadata, type CountRequestBuilder } from './count/index';
// @ts-ignore
import { OAuth2PermissionGrantItemRequestBuilderRequestsMetadata, type OAuth2PermissionGrantItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the oauth2PermissionGrants property of the microsoft.graph.user entity.
 */
export interface Oauth2PermissionGrantsRequestBuilder extends BaseRequestBuilder<Oauth2PermissionGrantsRequestBuilder> {
    /**
     * Provides operations to count the resources in the collection.
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
    get count(): CountRequestBuilder;
    /**
     * Provides operations to manage the oauth2PermissionGrants property of the microsoft.graph.user entity.
     * @param oAuth2PermissionGrantId The unique identifier of oAuth2PermissionGrant
     * @returns {OAuth2PermissionGrantItemRequestBuilder}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     byOAuth2PermissionGrantId(oAuth2PermissionGrantId: string) : OAuth2PermissionGrantItemRequestBuilder;
    /**
     * Get oauth2PermissionGrants from me
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OAuth2PermissionGrantCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     get(requestConfiguration?: RequestConfiguration<Oauth2PermissionGrantsRequestBuilderGetQueryParameters> | undefined) : Promise<OAuth2PermissionGrantCollectionResponse | undefined>;
    /**
     * Get oauth2PermissionGrants from me
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<Oauth2PermissionGrantsRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
/**
 * Get oauth2PermissionGrants from me
 */
export interface Oauth2PermissionGrantsRequestBuilderGetQueryParameters {
    /**
     * Include count of items
     */
    count?: boolean;
    /**
     * Expand related entities
     */
    expand?: string[];
    /**
     * Filter items by property values
     */
    filter?: string;
    /**
     * Order items by property values
     */
    orderby?: string[];
    /**
     * Search items by search phrases
     */
    search?: string;
    /**
     * Select properties to be returned
     */
    select?: string[];
    /**
     * Skip the first n items
     */
    skip?: number;
    /**
     * Show only the first n items
     */
    top?: number;
}
/**
 * Uri template for the request builder.
 */
export const Oauth2PermissionGrantsRequestBuilderUriTemplate = "{+baseurl}/me/oauth2PermissionGrants{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const Oauth2PermissionGrantsRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "count": "%24count",
    "expand": "%24expand",
    "filter": "%24filter",
    "orderby": "%24orderby",
    "search": "%24search",
    "select": "%24select",
    "skip": "%24skip",
    "top": "%24top",
};
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const Oauth2PermissionGrantsRequestBuilderNavigationMetadata: Record<Exclude<keyof Oauth2PermissionGrantsRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byOAuth2PermissionGrantId: {
        requestsMetadata: OAuth2PermissionGrantItemRequestBuilderRequestsMetadata,
        pathParametersMappings: ["oAuth2PermissionGrant%2Did"],
    },
    count: {
        requestsMetadata: CountRequestBuilderRequestsMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const Oauth2PermissionGrantsRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: Oauth2PermissionGrantsRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOAuth2PermissionGrantCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: Oauth2PermissionGrantsRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
