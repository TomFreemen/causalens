import { Redirect, Route, Switch } from 'react-router-dom';

import { DynamicComponent, PrivateRoute } from '@/shared';
import { RouteContent } from '@/types';

const PageNotFound = (): JSX.Element => {
    return (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <h2>404 - page not found</h2>
        </div>
    );
};

interface RouterContentProps {
    /** The list of routes to render content conditionally from */
    routes: Array<RouteContent>;
}

/**
 * The RouterContent component takes a list of RouterContent objects from the api and create a react-router based on
 * them.
 *
 * @param props - the component props
 */
function RouterContent(props: RouterContentProps): JSX.Element {
    return (
        <Switch>
            {props.routes.map(({ content, route, reset_vars_on_load, name }) => (
                <PrivateRoute key={route} name={name} path={route} reset_vars_on_load={reset_vars_on_load}>
                    <DynamicComponent component={content} />
                </PrivateRoute>
            ))}
            <Route exact path="/" render={() => <Redirect to={props.routes[0].route} />} />
            <Route component={PageNotFound} />
        </Switch>
    );
}

export default RouterContent;
