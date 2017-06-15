// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import notFoundRoute from "./404";

/*  Note: Instead of using JSX, we recommend using react-router
 PlainRoute objects to build route definitions.   */
const ROOT_PATH = '/';
export const createRoutes = (store) => ({
    path: ROOT_PATH,
    component: CoreLayout,
    // indexRoute: Home,
    onEnter({location},replace){
        if(location.pathname===ROOT_PATH)replace('/systems')
    },
    childRoutes: [
        require('./Admin/Layout')(store),
        require('./Operator/Layout')(store),
        notFoundRoute
    ]
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
 using getChildRoutes with the following signature:

 getChildRoutes (location, cb) {
 require.ensure([], (require) => {
 cb(null, [
 // Remove imports!
 require('./Counter').default(store)
 ])
 })
 }

 However, this is not necessary for code-splitting! It simply provides
 an API for async route definitions. Your code splitting should occur
 inside the route `getComponent` function, since it is only invoked
 when the route exists and matches.
 */

export default createRoutes
