import {graphQLClient, newGraphQLClient} from "~/lib/apollo";
import {GET_CATEGORIES} from "~/lib/apollo/queries/shop";
import {CREATE_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY} from "~/lib/apollo/mutations/category";

export async function getCategories(domain) {
    return await newGraphQLClient(domain).query({
        query: GET_CATEGORIES
    });
}

export async function updateCategory(patch) {
    return await graphQLClient.mutate({
        mutation: UPDATE_CATEGORY,
        variables: {
            patch
        },
        refetchQueries: [
            {query: GET_CATEGORIES},
        ],
    });

    return null
}

export async function deleteCategory(id) {
    try {
        return await graphQLClient.mutate({
            mutation: DELETE_CATEGORY,
            variables: {
                id
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function deleteCategories(ids) {
    try {
        return await graphQLClient.mutate({
            mutation: DELETE_CATEGORY,
            variables: {
                ids
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}

export async function createCategory(input) {
    try {
        return await graphQLClient.mutate({
            mutation: CREATE_CATEGORY,
            variables: {
                input
            },
            refetchQueries: [
                {query: GET_CATEGORIES},
            ],
        });
    } catch (e) {
        console.log(e)
    }

    return null
}