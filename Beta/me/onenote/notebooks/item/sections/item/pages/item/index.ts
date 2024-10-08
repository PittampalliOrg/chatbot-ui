/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { PreviewRequestBuilderRequestsMetadata, type PreviewRequestBuilder } from './preview/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /me/onenote/notebooks/{notebook-id}/sections/{onenoteSection-id}/pages/{onenotePage-id}
 */
export interface OnenotePageItemRequestBuilder extends BaseRequestBuilder<OnenotePageItemRequestBuilder> {
    /**
     * Provides operations to call the preview method.
     */
    get preview(): PreviewRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const OnenotePageItemRequestBuilderUriTemplate = "{+baseurl}/me/onenote/notebooks/{notebook%2Did}/sections/{onenoteSection%2Did}/pages/{onenotePage%2Did}";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const OnenotePageItemRequestBuilderNavigationMetadata: Record<Exclude<keyof OnenotePageItemRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    preview: {
        requestsMetadata: PreviewRequestBuilderRequestsMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
