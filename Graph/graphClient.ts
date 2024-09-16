/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { DrivesRequestBuilderNavigationMetadata, DrivesRequestBuilderRequestsMetadata, type DrivesRequestBuilder } from './drives/index';
// @ts-ignore
import { MeRequestBuilderNavigationMetadata, MeRequestBuilderRequestsMetadata, type MeRequestBuilder } from './me/index';
// @ts-ignore
import { SitesRequestBuilderNavigationMetadata, SitesRequestBuilderRequestsMetadata, type SitesRequestBuilder } from './sites/index';
// @ts-ignore
import { apiClientProxifier, registerDefaultDeserializer, registerDefaultSerializer, type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type RequestAdapter } from '@microsoft/kiota-abstractions';

/**
 * Instantiates a new {@link GraphClient} and sets the default values.
 * @param requestAdapter The request adapter to use to execute the requests.
 */
// @ts-ignore
export function createGraphClient(requestAdapter: RequestAdapter) {
    if (requestAdapter.baseUrl === undefined || requestAdapter.baseUrl === null || requestAdapter.baseUrl === "") {
        requestAdapter.baseUrl = "https://graph.microsoft.com/beta";
    }
    const pathParameters: Record<string, unknown> = {
        "baseurl": requestAdapter.baseUrl,
    };
    return apiClientProxifier<GraphClient>(requestAdapter, pathParameters, GraphClientNavigationMetadata, undefined);
}
/**
 * The main entry point of the SDK, exposes the configuration and the fluent API.
 */
export interface GraphClient extends BaseRequestBuilder<GraphClient> {
    /**
     * Provides operations to manage the collection of drive entities.
     */
    get drives(): DrivesRequestBuilder;
    /**
     * Provides operations to manage the user singleton.
     */
    get me(): MeRequestBuilder;
    /**
     * Provides operations to manage the collection of site entities.
     */
    get sites(): SitesRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const GraphClientUriTemplate = "{+baseurl}";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const GraphClientNavigationMetadata: Record<Exclude<keyof GraphClient, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    drives: {
        requestsMetadata: DrivesRequestBuilderRequestsMetadata,
        navigationMetadata: DrivesRequestBuilderNavigationMetadata,
    },
    me: {
        requestsMetadata: MeRequestBuilderRequestsMetadata,
        navigationMetadata: MeRequestBuilderNavigationMetadata,
    },
    sites: {
        requestsMetadata: SitesRequestBuilderRequestsMetadata,
        navigationMetadata: SitesRequestBuilderNavigationMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
