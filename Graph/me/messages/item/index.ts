/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createMessageFromDiscriminatorValue, type Message } from '../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../models/oDataErrors/index';
// @ts-ignore
import { SendRequestBuilderRequestsMetadata, type SendRequestBuilder } from './send/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the messages property of the microsoft.graph.user entity.
 */
export interface MessageItemRequestBuilder extends BaseRequestBuilder<MessageItemRequestBuilder> {
    /**
     * Provides operations to call the send method.
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
    get send(): SendRequestBuilder;
    /**
     * You can get a single resource instance expanded with a specific extended property, or a collection of resource instancesthat include extended properties matching a filter. Using the query parameter $expand allows you to get the specified resource instance expanded with a specific extendedproperty. Use a $filter and eq operator on the id property to specify the extended property. This is currently the only way to get the singleValueLegacyExtendedProperty object that represents an extended property. To get resource instances that have certain extended properties, use the $filter query parameter and apply an eq operatoron the id property. In addition, for numeric extended properties, apply one of the following operators on the value property:eq, ne,ge, gt, le, or lt. For string-typed extended properties, apply a contains, startswith, eq, or ne operator on value. Filtering the string name (Name) in the id of an extended property is case-sensitive. Filtering the value property of an extendedproperty is case-insensitive. The following user resources are supported: As well as the following group resources: See Extended properties overview for more information about when to useopen extensions or extended properties, and how to specify extended properties.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<Message>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/singlevaluelegacyextendedproperty-get?view=graph-rest-beta|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<MessageItemRequestBuilderGetQueryParameters> | undefined) : Promise<Message | undefined>;
    /**
     * You can get a single resource instance expanded with a specific extended property, or a collection of resource instancesthat include extended properties matching a filter. Using the query parameter $expand allows you to get the specified resource instance expanded with a specific extendedproperty. Use a $filter and eq operator on the id property to specify the extended property. This is currently the only way to get the singleValueLegacyExtendedProperty object that represents an extended property. To get resource instances that have certain extended properties, use the $filter query parameter and apply an eq operatoron the id property. In addition, for numeric extended properties, apply one of the following operators on the value property:eq, ne,ge, gt, le, or lt. For string-typed extended properties, apply a contains, startswith, eq, or ne operator on value. Filtering the string name (Name) in the id of an extended property is case-sensitive. Filtering the value property of an extendedproperty is case-insensitive. The following user resources are supported: As well as the following group resources: See Extended properties overview for more information about when to useopen extensions or extended properties, and how to specify extended properties.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<MessageItemRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
}
/**
 * You can get a single resource instance expanded with a specific extended property, or a collection of resource instancesthat include extended properties matching a filter. Using the query parameter $expand allows you to get the specified resource instance expanded with a specific extendedproperty. Use a $filter and eq operator on the id property to specify the extended property. This is currently the only way to get the singleValueLegacyExtendedProperty object that represents an extended property. To get resource instances that have certain extended properties, use the $filter query parameter and apply an eq operatoron the id property. In addition, for numeric extended properties, apply one of the following operators on the value property:eq, ne,ge, gt, le, or lt. For string-typed extended properties, apply a contains, startswith, eq, or ne operator on value. Filtering the string name (Name) in the id of an extended property is case-sensitive. Filtering the value property of an extendedproperty is case-insensitive. The following user resources are supported: As well as the following group resources: See Extended properties overview for more information about when to useopen extensions or extended properties, and how to specify extended properties.
 */
export interface MessageItemRequestBuilderGetQueryParameters {
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
export const MessageItemRequestBuilderUriTemplate = "{+baseurl}/me/messages/{message%2Did}{?%24expand,%24select}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const MessageItemRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "expand": "%24expand",
    "select": "%24select",
};
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const MessageItemRequestBuilderNavigationMetadata: Record<Exclude<keyof MessageItemRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    send: {
        requestsMetadata: SendRequestBuilderRequestsMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const MessageItemRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: MessageItemRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createMessageFromDiscriminatorValue,
        queryParametersMapper: MessageItemRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
