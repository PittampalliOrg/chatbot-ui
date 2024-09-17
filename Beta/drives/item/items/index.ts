/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { DriveItemItemRequestBuilderNavigationMetadata, type DriveItemItemRequestBuilder } from './item/index';
// @ts-ignore
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /drives/{drive-id}/items
 */
export interface ItemsRequestBuilder extends BaseRequestBuilder<ItemsRequestBuilder> {
    /**
     * Gets an item from the Chatbot-UI.Beta.drives.item.items.item collection
     * @param driveItemId The unique identifier of driveItem
     * @returns {DriveItemItemRequestBuilder}
     */
     byDriveItemId(driveItemId: string) : DriveItemItemRequestBuilder;
}
/**
 * Uri template for the request builder.
 */
export const ItemsRequestBuilderUriTemplate = "{+baseurl}/drives/{drive%2Did}/items";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const ItemsRequestBuilderNavigationMetadata: Record<Exclude<keyof ItemsRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byDriveItemId: {
        navigationMetadata: DriveItemItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["driveItem%2Did"],
    },
};
/* tslint:enable */
/* eslint-enable */
