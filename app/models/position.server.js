import {graphQLClient} from "~/lib/apollo";
import {GET_POSITIONS} from "~/lib/apollo/queries/shop";
import {DELETE_POSITION, UPDATE_POSITION} from "~/lib/apollo/mutations/position";

export async function getPositions() {
  return await graphQLClient.query({
    query: GET_POSITIONS,
  });
}

export async function updatePosition(patch) {
  try {
    return await graphQLClient.mutate({
      mutation: UPDATE_POSITION,
      variables: {
        patch
      }
    });
  } catch (e) {
    console.log(e)
  }
}

export async function deletePosition(id) {
  try {
    return await graphQLClient.mutate({
      mutation: DELETE_POSITION,
      variables: {
        id
      }
    });
  } catch (e) {
    console.log(e)
  }
}