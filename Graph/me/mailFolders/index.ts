/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { createMailFolderCollectionResponseFromDiscriminatorValue, type MailFolderCollectionResponse } from '../../models/index';
// @ts-ignore
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../models/oDataErrors/index';
// @ts-ignore
<<<<<<< HEAD
import { type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';
=======
import { MailFolderItemRequestBuilderRequestsMetadata, type MailFolderItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';
>>>>>>> mgt

/**
 * Provides operations to manage the mailFolders property of the microsoft.graph.user entity.
 */
export interface MailFoldersRequestBuilder extends BaseRequestBuilder<MailFoldersRequestBuilder> {
    /**
<<<<<<< HEAD
=======
     * Provides operations to manage the mailFolders property of the microsoft.graph.user entity.
     * @param mailFolderId The unique identifier of mailFolder
     * @returns {MailFolderItemRequestBuilder}
     * @deprecated  as of 2024-07/PrivatePreview:copilotExportAPI
     */
     byMailFolderId(mailFolderId: string) : MailFolderItemRequestBuilder;
    /**
>>>>>>> mgt
     * Get the mail folder collection directly under the root folder of the signed-in user. The returned collection includes any mail search folders directly under the root. By default, this operation does not return hidden folders. Use a query parameter includeHiddenFolders to include them in the response. This operation does not return all mail folders in a mailbox, only the child folders of the root folder. To return all mail folders in a mailbox, each child folder must be traversed separately.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<MailFolderCollectionResponse>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/user-list-mailfolders?view=graph-rest-1.0|Find more info here}
     */
     get(requestConfiguration?: RequestConfiguration<MailFoldersRequestBuilderGetQueryParameters> | undefined) : Promise<MailFolderCollectionResponse | undefined>;
    /**
<<<<<<< HEAD
     * Use this API to create a new mail folder in the root folder of the user's mailbox. If you intend a new folder to be hidden, you must set the isHidden property to true on creation.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<MailFolder>}
     * @throws {ODataError} error when the service returns a 4XX or 5XX status code
     * @see {@link https://learn.microsoft.com/graph/api/user-post-mailfolders?view=graph-rest-1.0|Find more info here}
     */
     post(body: MailFolder, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<MailFolder | undefined>;
    /**
=======
>>>>>>> mgt
     * Get the mail folder collection directly under the root folder of the signed-in user. The returned collection includes any mail search folders directly under the root. By default, this operation does not return hidden folders. Use a query parameter includeHiddenFolders to include them in the response. This operation does not return all mail folders in a mailbox, only the child folders of the root folder. To return all mail folders in a mailbox, each child folder must be traversed separately.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<MailFoldersRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
<<<<<<< HEAD
    /**
     * Use this API to create a new mail folder in the root folder of the user's mailbox. If you intend a new folder to be hidden, you must set the isHidden property to true on creation.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(body: MailFolder, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
=======
>>>>>>> mgt
}
/**
 * Get the mail folder collection directly under the root folder of the signed-in user. The returned collection includes any mail search folders directly under the root. By default, this operation does not return hidden folders. Use a query parameter includeHiddenFolders to include them in the response. This operation does not return all mail folders in a mailbox, only the child folders of the root folder. To return all mail folders in a mailbox, each child folder must be traversed separately.
 */
export interface MailFoldersRequestBuilderGetQueryParameters {
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
     * Include Hidden Folders
     */
    includeHiddenFolders?: string;
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
export const MailFoldersRequestBuilderUriTemplate = "{+baseurl}/me/mailFolders{?%24count,%24expand,%24filter,%24orderby,%24search,%24select,%24skip,%24top,includeHiddenFolders*}";
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const MailFoldersRequestBuilderGetQueryParametersMapper: Record<string, string> = {
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
<<<<<<< HEAD
=======
 * Metadata for all the navigation properties in the request builder.
 */
export const MailFoldersRequestBuilderNavigationMetadata: Record<Exclude<keyof MailFoldersRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byMailFolderId: {
        requestsMetadata: MailFolderItemRequestBuilderRequestsMetadata,
        pathParametersMappings: ["mailFolder%2Did"],
    },
};
/**
>>>>>>> mgt
 * Metadata for all the requests in the request builder.
 */
export const MailFoldersRequestBuilderRequestsMetadata: RequestsMetadata = {
    get: {
        uriTemplate: MailFoldersRequestBuilderUriTemplate,
        responseBodyContentType: "application/json",
        errorMappings: {
            XXX: createODataErrorFromDiscriminatorValue as ParsableFactory<Parsable>,
        },
        adapterMethodName: "send",
        responseBodyFactory:  createMailFolderCollectionResponseFromDiscriminatorValue,
        queryParametersMapper: MailFoldersRequestBuilderGetQueryParametersMapper,
    },
};
/* tslint:enable */
/* eslint-enable */
