/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createChecklistItemFromDiscriminatorValue, serializeChecklistItem, type ChecklistItem } from '../../../../../../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../../../../../../models/oDataErrors/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the checklistItems property of the microsoft.graph.todoTask entity.
 */
export interface ChecklistItemItemRequestBuilder extends BaseRequestBuilder<ChecklistItemItemRequestBuilder> {
    /**
     * Delete a checklistItem object.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/checklistitem-delete?view=graph-rest-1.0|Find more info here}
     */
     delete(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<void>;
    /**
     * Read the properties and relationships of a checklistItem object.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<ChecklistItem>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/checklistitem-get?view=graph-rest-1.0|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<ChecklistItemItemRequestBuilderGetQueryParameters> | undefined) : Promise<ChecklistItem | undefined>;
    /**
     * Update the properties of a checklistItem object.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<ChecklistItem>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/checklistitem-update?view=graph-rest-1.0|Find more info here}
     */
     patch(body: ChecklistItem, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<ChecklistItem | undefined>;
    /**
     * Delete a checklistItem object.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toDeleteRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
    /**
     * Read the properties and relationships of a checklistItem object.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<ChecklistItemItemRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Update the properties of a checklistItem object.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPatchRequestInformation(body: ChecklistItem, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Read the properties and relationships of a checklistItem object.
 */
export interface ChecklistItemItemRequestBuilderGetQueryParameters {
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
export const ChecklistItemItemRequestBuilderUriTemplate = "{+baseurl}/me/todo/lists/{todoTaskList%2Did}/tasks/{todoTask%2Did}/checklistItems/{checklistItem%2Did}{?%24expand,%24select}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const ChecklistItemItemRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "expand": "%24expand",
    "select": "%24select",
};
/**
 * Metadata for all the requests in the request builder.
 */
export const ChecklistItemItemRequestBuilderRequestsMetadata: RequestsMetadata = {
    delete: {
        uriTemplate: ChecklistItemItemRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "sendNoResponseContent",
    },
    get: {
        uriTemplate: ChecklistItemItemRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createChecklistItemFromDiscriminatorValue,
        queryParametersMapper: ChecklistItemItemRequestBuilderGetQueryParametersMapper,
    },
    patch: {
        uriTemplate: ChecklistItemItemRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createChecklistItemFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeChecklistItem,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
