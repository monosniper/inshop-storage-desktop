import {newGraphQLClient} from "~/lib/apollo";
import {GET_MODULES} from "~/lib/apollo/queries/shop";
import {ACTIVATE_MODULE, DEACTIVATE_MODULE, GET_MODULE, BUY_MODULE} from "~/lib/apollo/mutations/module";

export async function getModules(domain) {
    return await newGraphQLClient(domain).query({
        query: GET_MODULES
    });
}

export async function getModule(domain, slug) {
    return await newGraphQLClient(domain).query({
        query: GET_MODULE,
        variables: {
            slug
        }
    });
}

export async function activateModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: ACTIVATE_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}

export async function deactivateModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: DEACTIVATE_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}

export async function buyModule(domain, id) {
    return await newGraphQLClient(domain).mutate({
        mutation: BUY_MODULE,
        variables: {
            id
        },
        refetchQueries: [
            {query: GET_MODULES},
        ],
    });
}