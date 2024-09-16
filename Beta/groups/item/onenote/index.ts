/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { NotebooksRequestBuilderNavigationMetadata, type NotebooksRequestBuilder } from './notebooks/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /groups/{group-id}/onenote
 */
export interface OnenoteRequestBuilder extends BaseRequestBuilder<OnenoteRequestBuilder> {
    /**
     * The notebooks property
     */
    get notebooks(): NotebooksRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const OnenoteRequestBuilderUriTemplate = "{+baseurl}/groups/{group%2Did}/onenote";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const OnenoteRequestBuilderNavigationMetadata: Record<Exclude<keyof OnenoteRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    notebooks: {
        navigationMetadata: NotebooksRequestBuilderNavigationMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
