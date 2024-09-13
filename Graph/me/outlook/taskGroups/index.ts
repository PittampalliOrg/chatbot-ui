/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createOutlookTaskGroupCollectionResponseFromDiscriminatorValue, createOutlookTaskGroupFromDiscriminatorValue, serializeOutlookTaskGroup, type OutlookTaskGroup, type OutlookTaskGroupCollectionResponse } from '../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../models/oDataErrors/index';
// @ts-ignore
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the taskGroups property of the microsoft.graph.outlookUser entity.
 */
export interface TaskGroupsRequestBuilder extends BaseRequestBuilder<TaskGroupsRequestBuilder> {
    /**
     * Get all the Outlook task groups in the user's mailbox. The response always includes the default task group My Tasks, and any other task groups that have been created in the mailbox.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OutlookTaskGroupCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/outlookuser-list-taskgroups?view=graph-rest-beta|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<TaskGroupsRequestBuilderGetQueryParameters> | undefined) : Promise<OutlookTaskGroupCollectionResponse | undefined>;
    /**
     * Create an Outlook task group in the user's mailbox.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<OutlookTaskGroup>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/outlookuser-post-taskgroups?view=graph-rest-beta|Find more info here}
     */
     post(body: OutlookTaskGroup, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<OutlookTaskGroup | undefined>;
    /**
     * Get all the Outlook task groups in the user's mailbox. The response always includes the default task group My Tasks, and any other task groups that have been created in the mailbox.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<TaskGroupsRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Create an Outlook task group in the user's mailbox.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toPostRequestInformation(body: OutlookTaskGroup, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Get all the Outlook task groups in the user's mailbox. The response always includes the default task group My Tasks, and any other task groups that have been created in the mailbox.
 */
export interface TaskGroupsRequestBuilderGetQueryParameters {
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
export const TaskGroupsRequestBuilderUriTemplate = "{+baseurl}/me/outlook/taskGroups{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const TaskGroupsRequestBuilderGetQueryParametersMapper: Record<string, string> = {
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
export const TaskGroupsRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: TaskGroupsRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOutlookTaskGroupCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: TaskGroupsRequestBuilderGetQueryParametersMapper,
    },
    post: {
        uriTemplate: TaskGroupsRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createOutlookTaskGroupFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeOutlookTaskGroup,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
