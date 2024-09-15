/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createTodoTaskCollectionResponseFromDiscriminatorValue, createTodoTaskFromDiscriminatorValue, serializeTodoTask, type TodoTask, type TodoTaskCollectionResponse } from '../../../../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../../../models/oDataErrors/index';
// @ts-ignore
import { CountRequestBuilderRequestsMetadata, type CountRequestBuilder } from './count/index';
// @ts-ignore
import { DeltaRequestBuilderRequestsMetadata, type DeltaRequestBuilder } from './delta/index';
// @ts-ignore
import { TodoTaskItemRequestBuilderNavigationMetadata, TodoTaskItemRequestBuilderRequestsMetadata, type TodoTaskItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Provides operations to manage the tasks property of the microsoft.graph.todoTaskList entity.
 */
export interface TasksRequestBuilder extends BaseRequestBuilder<TasksRequestBuilder> {
    /**
     * Provides operations to count the resources in the collection.
     */
    get count(): CountRequestBuilder;
    /**
     * Provides operations to call the delta method.
     */
    get delta(): DeltaRequestBuilder;
    /**
     * Provides operations to manage the tasks property of the microsoft.graph.todoTaskList entity.
     * @param todoTaskId The unique identifier of todoTask
     * @returns {TodoTaskItemRequestBuilder}
     */
     byTodoTaskId(todoTaskId: string) : TodoTaskItemRequestBuilder;
    /**
     * Get the todoTask resources from the tasks navigation property of a specified todoTaskList.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<TodoTaskCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/todotasklist-list-tasks?view=graph-rest-1.0|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<TasksRequestBuilderGetQueryParameters> | undefined) : Promise<TodoTaskCollectionResponse | undefined>;
    /**
     * Create a new task object in a specified todoTaskList.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<TodoTask>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/todotasklist-post-tasks?view=graph-rest-1.0|Find more info here}
     */
     post(body: TodoTask, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<TodoTask | undefined>;
    /**
     * Get the todoTask resources from the tasks navigation property of a specified todoTaskList.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<TasksRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Create a new task object in a specified todoTaskList.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(body: TodoTask, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Get the todoTask resources from the tasks navigation property of a specified todoTaskList.
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
export const TasksRequestBuilderUriTemplate = "{+baseurl}/me/todo/lists/{todoTaskList%2Did}/tasks{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top}";
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
 * Metadata for all the navigation properties in the request builder.
 */
export const TasksRequestBuilderNavigationMetadata: Record<Exclude<keyof TasksRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byTodoTaskId: {
        requestsMetadata: TodoTaskItemRequestBuilderRequestsMetadata,
        navigationMetadata: TodoTaskItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["todoTask%2Did"],
    },
    count: {
        requestsMetadata: CountRequestBuilderRequestsMetadata,
    },
    delta: {
        requestsMetadata: DeltaRequestBuilderRequestsMetadata,
    },
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
        responseBodyFactory:  createTodoTaskCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: TasksRequestBuilderGetQueryParametersMapper,
    },
    post: {
        uriTemplate: TasksRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createTodoTaskFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeTodoTask,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */
