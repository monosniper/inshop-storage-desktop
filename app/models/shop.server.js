import {graphQLClient} from "~/lib/apollo";
import {GET_CATEGORIES, GET_SHOPS} from "~/lib/apollo/queries/shop";
import {DELETE_CATEGORY} from "~/lib/apollo/mutations/category";

export async function getShops(userId) {
  try {
    return await graphQLClient.query({
      query: GET_SHOPS,
      variables: {
        userId
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
  }
}