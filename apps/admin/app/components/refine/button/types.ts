import type { BaseKey } from "@refinedev/core";
import type { Button } from "~/components/core/button";

export type CreateButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export type CloneButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export type DeleteButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export type EditButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export type StatusButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    // /**
    //  * Access Control configuration for the button
    //  * @default `{ enabled: true, hideIfUnauthorized: false }`
    //  */
    // accessControl?: {
    //     enabled?: boolean;
    //     hideIfUnauthorized?: boolean;
    // };
} & React.ComponentProps<typeof Button>;

export type RefreshButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    /**
     * Target data provider name for API call to be made
     * @default `"default"`
     */
    dataProviderName?: string;
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export type ShowButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: string;
    /**
     * Data item identifier for the actions with the API
     * @default Reads `:id` from the URL
     */
    recordItemId?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;


export type ListButtonProps = {
    /**
     * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
     * @default Inferred resource name from the route
     */
    resource?: BaseKey;
    /**
     * Access Control configuration for the button
     * @default `{ enabled: true, hideIfUnauthorized: false }`
     */
    accessControl?: {
        enabled?: boolean;
        hideIfUnauthorized?: boolean;
    };
    /**
     * `meta` property is used when creating the URL for the related action and path.
     */
    meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;