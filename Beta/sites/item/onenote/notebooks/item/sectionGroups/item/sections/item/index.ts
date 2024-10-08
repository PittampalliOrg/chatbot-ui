/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { PagesRequestBuilderNavigationMetadata, type PagesRequestBuilder } from './pages/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /sites/{site-id}/onenote/notebooks/{notebook-id}/sectionGroups/{sectionGroup-id}/sections/{onenoteSection-id}
 */
export interface OnenoteSectionItemRequestBuilder extends BaseRequestBuilder<OnenoteSectionItemRequestBuilder> {
    /**
     * The pages property
     */
    get pages(): PagesRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const OnenoteSectionItemRequestBuilderUriTemplate = "{+baseurl}/sites/{site%2Did}/onenote/notebooks/{notebook%2Did}/sectionGroups/{sectionGroup%2Did}/sections/{onenoteSection%2Did}";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const OnenoteSectionItemRequestBuilderNavigationMetadata: Record<Exclude<keyof OnenoteSectionItemRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    pages: {
        navigationMetadata: PagesRequestBuilderNavigationMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
