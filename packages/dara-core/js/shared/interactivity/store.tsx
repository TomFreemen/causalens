import { RecoilState, RecoilValue } from 'recoil';

import { RequestExtrasSerializable } from '@/api/http';
import { getUniqueIdentifier } from '@/shared/utils/hashing';
import { AnyVariable, isVariable } from '@/types';

/**
 * Selector family type which constructs a selector from a given set of extras.
 */
export type SelectorFamily = (P: RequestExtrasSerializable) => RecoilValue<any>;

/**
 * Atom family type which constructs an atom from a given set of extras.
 */
export type AtomFamily = (P: RequestExtrasSerializable) => RecoilState<any>;

/**
 * Key -> trigger atom
 */
export const dataRegistry = new Map<string, RecoilState<TriggerIndexValue>>();
/**
 * Key -> atom
 */
export const atomRegistry = new Map<string, RecoilState<any>>();
/**
 * Key -> atom family
 */
export const atomFamilyRegistry = new Map<string, AtomFamily>();
/**
 * Atom family function => {extras => atom}
 *
 * Stores all instances of a given atom family, as a map of seriailzed extras to atom.
 */
export const atomFamilyMembersRegistry = new Map<AtomFamily, Map<string, RecoilState<any>>>();
/**
 * Key -> selector
 */
export const selectorRegistry = new Map<string, RecoilValue<any>>();
/**
 * Key -> selector family
 */
export const selectorFamilyRegistry = new Map<string, SelectorFamily>();
/**
 * Selector family function => {extras => selector}
 *
 * Stores all instances of a given selector family, as a map of seriailzed extras to selector.
 */
export const selectorFamilyMembersRegistry = new Map<SelectorFamily, Map<string, RecoilValue<any>>>();
/**
 * Key -> dependencies data for a selector
 */
export const depsRegistry = new Map<
    string,
    {
        args: any[];
        cacheKey: string;
        result: any;
    }
>();

export type TriggerIndexValue = {
    force: boolean;
    inc: number;
};

type RegistryKeyType = 'selector' | 'derived-selector' | 'trigger' | 'filters';

/**
 * Get a unique registry key of a given type for a given variable.
 *
 * @param variable variable to get the key for
 * @param type type of the registry entry
 */
export function getRegistryKey<T>(variable: AnyVariable<T>, type: RegistryKeyType): string {
    return `${getUniqueIdentifier(variable)}-${type}`;
}

/**
 * Clear registries - to be used in tests only.
 */
export function clearRegistries_TEST(): void {
    for (const registry of [
        dataRegistry,
        atomRegistry,
        atomFamilyRegistry,
        atomFamilyMembersRegistry,
        selectorRegistry,
        depsRegistry,
        selectorFamilyRegistry,
        selectorFamilyMembersRegistry,
    ]) {
        registry.clear();
    }
}

/**
 * Check whether a given variable is registered within the application
 * (More strictly, under the current RecoilRoot)
 *
 * @param variable variable to check
 */
export function isRegistered<T>(variable: AnyVariable<T>): boolean {
    if (!isVariable(variable)) {
        return false;
    }

    switch (variable.__typename) {
        case 'Variable': {
            if (atomRegistry.has(variable.uid)) {
                return true;
            }
            const family = atomFamilyRegistry.get(variable.uid);
            return atomFamilyMembersRegistry.get(family)?.size > 0;
        }

        case 'UrlVariable':
        case 'DataVariable':
            return atomRegistry.has(variable.uid);

        case 'DerivedVariable': {
            const key = getRegistryKey(variable, 'selector');
            return selectorFamilyRegistry.has(key);
        }

        case 'DerivedDataVariable': {
            const key = getRegistryKey(variable, 'selector');
            return selectorFamilyRegistry.has(key);
        }

        default:
            return false;
    }
}
