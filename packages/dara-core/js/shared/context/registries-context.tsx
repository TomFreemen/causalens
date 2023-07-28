import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { createContext } from 'react';

import { RequestError } from '@darajs/ui-utils';

import { ActionDef, Component } from '@/types';

type RegistriesCtx = {
    /**
     * Action registry
     */
    actionRegistry: Record<string, ActionDef>;
    /**
     * Component registry
     */
    componentRegistry: Record<string, Component>;
    /**
     * Callback to force a refetch of the components registry
     */
    refetchComponents: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<Record<string, Component>, RequestError>>;
};

const registriesCtx = createContext<RegistriesCtx>({
    actionRegistry: {},
    componentRegistry: {},
    refetchComponents: null,
});

export default registriesCtx;
