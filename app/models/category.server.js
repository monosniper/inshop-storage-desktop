import {graphQLClient} from "~/lib/apollo";
import {GET_CATEGORIES} from "~/lib/apollo/queries/shop";

export async function getCategories() {
    return await graphQLClient.query({
        query: GET_CATEGORIES,
    });
}