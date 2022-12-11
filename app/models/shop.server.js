import {graphQLClient} from "~/lib/apollo";
import {GET_SHOPS} from "~/lib/apollo/queries/shop";

export async function getShops(userId) {
  return await graphQLClient.query({
    query: GET_SHOPS,
    variables: {
      userId
    },
  });
}