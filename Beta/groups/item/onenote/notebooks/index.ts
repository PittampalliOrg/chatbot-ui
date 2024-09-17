/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { NotebookItemRequestBuilderNavigationMetadata, type NotebookItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /groups/{group-id}/onenote/notebooks
 */
export interface NotebooksRequestBuilder extends BaseRequestBuilder<NotebooksRequestBuilder> {
    /**
     * Gets an item from the Chatbot-UI.Beta.groups.item.onenote.notebooks.item collection
     * @param notebookId The unique identifier of notebook
     * @returns {NotebookItemRequestBuilder}
     */
     byNotebookId(notebookId: string) : NotebookItemRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const NotebooksRequestBuilderUriTemplate = "{+baseurl}/groups/{group%2Did}/onenote/notebooks";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const NotebooksRequestBuilderNavigationMetadata: Record<Exclude<keyof NotebooksRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byNotebookId: {
        navigationMetadata: NotebookItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["notebook%2Did"],
    },
};
/* tslint:enable */
/* eslint-enable */
