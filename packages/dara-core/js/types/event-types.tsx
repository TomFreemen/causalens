import { ComponentInstance, DerivedVariable, Variable } from './core';

/**
 * Map of available global events,
 * format: {eventName: eventData}
 */
export interface DaraEventMap {
    SERVER_COMPONENT_LOADED: { name: string; uid: string; value: ComponentInstance };
    DERIVED_VARIABLE_LOADED: { variable: DerivedVariable; value: any };
    PLAIN_VARIABLE_LOADED: { variable: Variable<any>; value: any };
}

/**
 * Event type
 */
export type DaraEventType = keyof DaraEventMap;

/** Discriminated union of all available events */
export type DaraEvent = {
    [K in DaraEventType]: { type: K; data: DaraEventMap[K] };
}[DaraEventType];
