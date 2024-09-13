/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createOutlookTaskCollectionResponseFromDiscriminatorValue, createOutlookTaskFromDiscriminatorValue, serializeOutlookTask, type OutlookTask, type OutlookTaskCollectionResponse } from '../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../models/oDataErrors/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the tasks property of the microsoft.graph.outlookUser entity.
 */
export interface TasksRequestBuilder extends BaseRequestBuilder<TasksRequestBuilder> {
    /**
     * Get all the Outlook tasks in the user's mailbox. By default, this operation (and the POST, PATCH, and complete task operations) returns date-related properties in UTC.You can use the Prefer: outlook.timezone header to have all the date-related properties in the response represented in a time zonedifferent than UTC. See an example for getting a single task. You can apply the header similarly to get multiple tasks.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OutlookTaskCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/outlookuser-list-tasks?view=graph-rest-beta|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<TasksRequestBuilderGetQueryParameters> | undefined) : Promise<OutlookTaskCollectionResponse | undefined>;
    /**
     * Create an Outlook task in the default task group (My Tasks) and default task folder (Tasks) in the user's mailbox. The POST method always ignores the time portion of startDateTime and dueDateTime in the request body, and assumes the time to be always midnight in the specified time zone. By default, this operation (and the GET, PATCH, and complete task operations) returns date-related properties in UTC. You can use the Prefer: outlook.timezone header to have all the date-related properties in the response represented in a time zone different than UTC.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OutlookTask>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/outlookuser-post-tasks?view=graph-rest-beta|Find more info here}
     */
     post(body: OutlookTask, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<OutlookTask | undefined>;
    /**
     * Get all the Outlook tasks in the user's mailbox. By default, this operation (and the POST, PATCH, and complete task operations) returns date-related properties in UTC.You can use the Prefer: outlook.timezone header to have all the date-related properties in the response represented in a time zonedifferent than UTC. See an example for getting a single task. You can apply the header similarly to get multiple tasks.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<TasksRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Create an Outlook task in the default task group (My Tasks) and default task folder (Tasks) in the user's mailbox. The POST method always ignores the time portion of startDateTime and dueDateTime in the request body, and assumes the time to be always midnight in the specified time zone. By default, this operation (and the GET, PATCH, and complete task operations) returns date-related properties in UTC. You can use the Prefer: outlook.timezone header to have all the date-related properties in the response represented in a time zone different than UTC.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toPostRequestInformation(body: OutlookTask, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Get all the Outlook tasks in the user's mailbox. By default, this operation (and the POST, PATCH, and complete task operations) returns date-related properties in UTC.You can use the Prefer: outlook.timezone header to have all the date-related properties in the response represented in a time zonedifferent than UTC. See an example for getting a single task. You can apply the header similarly to get multiple tasks.
 */
export interface TasksRequestBuilderGetQueryParameters {
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
export const TasksRequestBuilderUriTemplate = "{+baseurl}/me/outlook/tasks{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const TasksRequestBuilderGetQueryParametersMapper: Record<string, string> = {
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
 * Metadata for all the requests in the request builder.
 */
export const TasksRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: TasksRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOutlookTaskCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: TasksRequestBuilderGetQueryParametersMapper,
    },
    post: {
        uriTemplate: TasksRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOutlookTaskFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeOutlookTask,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
