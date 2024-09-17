/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createLinkedResourceCollectionResponseFromDiscriminatorValue, createLinkedResourceFromDiscriminatorValue, serializeLinkedResource, type LinkedResource, type LinkedResourceCollectionResponse } from '../../../../../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../../../../../models/oDataErrors/index';
// @ts-ignore
import { CountRequestBuilderRequestsMetadata, type CountRequestBuilder } from './count/index';
// @ts-ignore
import { LinkedResourceItemRequestBuilderRequestsMetadata, type LinkedResourceItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the linkedResources property of the microsoft.graph.todoTask entity.
 */
export interface LinkedResourcesRequestBuilder extends BaseRequestBuilder<LinkedResourcesRequestBuilder> {
    /**
     * Provides operations to count the resources in the collection.
<<<<<<< HEAD
=======
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
>>>>>>> mgt
     */
    get count(): CountRequestBuilder;
    /**
     * Provides operations to manage the linkedResources property of the microsoft.graph.todoTask entity.
     * @param linkedResourceId The unique identifier of linkedResource
     * @returns {LinkedResourceItemRequestBuilder}
<<<<<<< HEAD
=======
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
>>>>>>> mgt
     */
     byLinkedResourceId(linkedResourceId: string) : LinkedResourceItemRequestBuilder;
    /**
     * Get information of one or more items in a partner application, based on which a specified task was created. The information is represented in a linkedResource object for each item. It includes an external ID for the item in the partner application, and if applicable, a deep link to that item in the application.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<LinkedResourceCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
<<<<<<< HEAD
     * @see {@link https://learn.microsoft.com/graph/api/todotask-list-linkedresources?view=graph-rest-1.0|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<LinkedResourcesRequestBuilderGetQueryParameters> | undefined) : Promise<LinkedResourceCollectionResponse | undefined>;
    /**
     * Create a linkedResource object to associate a specified task with an item in a partner application. For example, you can associate a task with an email item in Outlook that spurred the task, and you can create a linkedResource object to track its association. You can also create a linkedResource object while creating a task.
=======
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/todotask-list-linkedresources?view=graph-rest-beta|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<LinkedResourcesRequestBuilderGetQueryParameters> | undefined) : Promise<LinkedResourceCollectionResponse | undefined>;
    /**
     * Create a linkedResource object to associate a specified task with an item in a partner application. For example, you can associate a task with an email item in Outlook that spurred the task, and you can create a linkedResource object to track its association. You can also create a linkedResource object while creating a todoTask.
>>>>>>> mgt
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<LinkedResource>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
<<<<<<< HEAD
     * @see {@link https://learn.microsoft.com/graph/api/todotask-post-linkedresources?view=graph-rest-1.0|Find more info here}
=======
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     * @see {@link https://learn.microsoft.com/graph/api/todotask-post-linkedresources?view=graph-rest-beta|Find more info here}
>>>>>>> mgt
     */
     post(body: LinkedResource, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<LinkedResource | undefined>;
    /**
     * Get information of one or more items in a partner application, based on which a specified task was created. The information is represented in a linkedResource object for each item. It includes an external ID for the item in the partner application, and if applicable, a deep link to that item in the application.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
<<<<<<< HEAD
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<LinkedResourcesRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Create a linkedResource object to associate a specified task with an item in a partner application. For example, you can associate a task with an email item in Outlook that spurred the task, and you can create a linkedResource object to track its association. You can also create a linkedResource object while creating a task.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
=======
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<LinkedResourcesRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Create a linkedResource object to associate a specified task with an item in a partner application. For example, you can associate a task with an email item in Outlook that spurred the task, and you can create a linkedResource object to track its association. You can also create a linkedResource object while creating a todoTask.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
>>>>>>> mgt
     */
     toPostRequestInformation(body: LinkedResource, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Get information of one or more items in a partner application, based on which a specified task was created. The information is represented in a linkedResource object for each item. It includes an external ID for the item in the partner application, and if applicable, a deep link to that item in the application.
 */
export interface LinkedResourcesRequestBuilderGetQueryParameters {
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
export const LinkedResourcesRequestBuilderUriTemplate = "{+baseurl}/me/todo/lists/{todoTaskList%2Did}/tasks/{todoTask%2Did}/linkedResources{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const LinkedResourcesRequestBuilderGetQueryParametersMapper: Record<string, string> = {
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
export const LinkedResourcesRequestBuilderNavigationMetadata: Record<Exclude<keyof LinkedResourcesRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byLinkedResourceId: {
        requestsMetadata: LinkedResourceItemRequestBuilderRequestsMetadata,
        pathParametersMappings: ["linkedResource%2Did"],
    },
    count: {
        requestsMetadata: CountRequestBuilderRequestsMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const LinkedResourcesRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: LinkedResourcesRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createLinkedResourceCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: LinkedResourcesRequestBuilderGetQueryParametersMapper,
    },
    post: {
        uriTemplate: LinkedResourcesRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createLinkedResourceFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeLinkedResource,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
