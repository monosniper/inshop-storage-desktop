import {graphQLClient, newGraphQLClient} from "~/lib/apollo";
import {GET_POSITIONS} from "~/lib/apollo/queries/shop";
import {CREATE_POSITION, DELETE_POSITION, DELETE_POSITIONS, UPDATE_POSITION} from "~/lib/apollo/mutations/position";

export async function getPositions(domain) {
  return await newGraphQLClient(domain).query({
    query: GET_POSITIONS
  });
}

export async function updatePosition(patch) {
  return await graphQLClient.mutate({
    mutation: UPDATE_POSITION,
    variables: {
      patch
    },
    refetchQueries: [
      {query: GET_POSITIONS},
    ],
  });

  return null
}

export async function deletePosition(id) {
  try {
    return await graphQLClient.mutate({
      mutation: DELETE_POSITION,
      variables: {
        id
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}

export async function deletePositions(ids) {
  try {
    return await graphQLClient.mutate({
      mutation: DELETE_POSITIONS,
      variables: {
        ids
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}

export async function createPosition(input) {
  try {
    return await graphQLClient.mutate({
      mutation: CREATE_POSITION,
      variables: {
        input
      },
      refetchQueries: [
        {query: GET_POSITIONS},
      ],
    });
  } catch (e) {
    console.log(e)
  }

  return null
}