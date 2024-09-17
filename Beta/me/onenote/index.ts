/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { NotebooksRequestBuilderNavigationMetadata, type NotebooksRequestBuilder } from './notebooks/index';
// @ts-ignore
import { PagesRequestBuilderNavigationMetadata, type PagesRequestBuilder } from './pages/index';
// @ts-ignore
import { SectionGroupsRequestBuilderNavigationMetadata, type SectionGroupsRequestBuilder } from './sectionGroups/index';
// @ts-ignore
import { SectionsRequestBuilderNavigationMetadata, type SectionsRequestBuilder } from './sections/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /me/onenote
 */
export interface OnenoteRequestBuilder extends BaseRequestBuilder<OnenoteRequestBuilder> {
    /**
     * The notebooks property
     */
    get notebooks(): NotebooksRequestBuilder;
    /**
     * The pages property
     */
    get pages(): PagesRequestBuilder;
    /**
     * The sectionGroups property
     */
    get sectionGroups(): SectionGroupsRequestBuilder;
    /**
     * The sections property
     */
    get sections(): SectionsRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const OnenoteRequestBuilderUriTemplate = "{+baseurl}/me/onenote";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const OnenoteRequestBuilderNavigationMetadata: Record<Exclude<keyof OnenoteRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    notebooks: {
        navigationMetadata: NotebooksRequestBuilderNavigationMetadata,
    },
    pages: {
        navigationMetadata: PagesRequestBuilderNavigationMetadata,
    },
    sectionGroups: {
        navigationMetadata: SectionGroupsRequestBuilderNavigationMetadata,
    },
    sections: {
        navigationMetadata: SectionsRequestBuilderNavigationMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
