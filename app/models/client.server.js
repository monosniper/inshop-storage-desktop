import {graphQLClient, newGraphQLClient} from "~/lib/apollo";
import {GET_CLIENTS} from "~/lib/apollo/queries/shop";
import {CREATE_CLIENT, DELETE_CLIENT, DELETE_CLIENTS, UPDATE_CLIENT} from "~/lib/apollo/mutations/client";
import {error} from "@remix-run/dev/dist/colors";

export async function getClients(domain) {
    return await newGraphQLClient(domain).query({
        query: GET_CLIENTS
    });
}

export async function updateClient(patch) {
    try {
        return await graphQLClient.mutate({
            mutation: UPDATE_CLIENT,
            variables: {
                patch
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        const err = JSON.parse(JSON.stringify(e))
        console.log(err)
        err.networkError && console.error(err.networkError.result.errors)
    }

    return null
}

export async function deleteClient(id) {
    try {
        return await graphQLClient.mutate({
            mutation: DELETE_CLIENT,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function deleteClients(ids) {
    try {
        return await graphQLClient.mutate({
            mutation: DELETE_CLIENTS,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}

export async function createClient(input) {
    try {
        return await graphQLClient.mutate({
            mutation: CREATE_CLIENT,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_CLIENTS},
            ],
        });
    } catch (e) {
        console.log(JSON.parse(JSON.stringify(e)))
    }

    return null
}