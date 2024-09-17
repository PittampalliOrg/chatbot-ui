/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createMessageCollectionResponseFromDiscriminatorValue, type MessageCollectionResponse } from '../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../models/oDataErrors/index';
// @ts-ignore
import { DeltaRequestBuilderRequestsMetadata, type DeltaRequestBuilder } from './delta/index';
// @ts-ignore
import { MessageItemRequestBuilderNavigationMetadata, MessageItemRequestBuilderRequestsMetadata, type MessageItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the messages property of the microsoft.graph.user entity.
 */
export interface MessagesRequestBuilder extends BaseRequestBuilder<MessagesRequestBuilder> {
    /**
     * Provides operations to call the delta method.
     */
    get delta(): DeltaRequestBuilder;
    /**
     * Provides operations to manage the messages property of the microsoft.graph.user entity.
     * @param messageId The unique identifier of message
     * @returns {MessageItemRequestBuilder}
     */
     byMessageId(messageId: string) : MessageItemRequestBuilder;
    /**
     * Get an open extension (openTypeExtension object) identified by name or fully qualified name. The table in the Permissions section lists the resources that support open extensions. The following table lists the three scenarios where you can get an open extension from a supported resource instance.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<MessageCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/opentypeextension-get?view=graph-rest-1.0|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<MessagesRequestBuilderGetQueryParameters> | undefined) : Promise<MessageCollectionResponse | undefined>;
    /**
     * Get an open extension (openTypeExtension object) identified by name or fully qualified name. The table in the Permissions section lists the resources that support open extensions. The following table lists the three scenarios where you can get an open extension from a supported resource instance.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<MessagesRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
/**
 * Get an open extension (openTypeExtension object) identified by name or fully qualified name. The table in the Permissions section lists the resources that support open extensions. The following table lists the three scenarios where you can get an open extension from a supported resource instance.
 */
export interface MessagesRequestBuilderGetQueryParameters {
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
     * Include Hidden Messages
     */
    includeHiddenMessages?: string;
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
export const MessagesRequestBuilderUriTemplate = "{+baseurl}/me/messages{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top,includeHiddenMessages*}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const MessagesRequestBuilderGetQueryParametersMapper: Record<string, string> = {
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
export const MessagesRequestBuilderNavigationMetadata: Record<Exclude<keyof MessagesRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byMessageId: {
        requestsMetadata: MessageItemRequestBuilderRequestsMetadata,
        navigationMetadata: MessageItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["message%2Did"],
    },
    delta: {
        requestsMetadata: DeltaRequestBuilderRequestsMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const MessagesRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: MessagesRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createMessageCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: MessagesRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
