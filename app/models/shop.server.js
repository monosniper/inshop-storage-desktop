import {graphQLClient, newGraphQLClient} from "~/lib/apollo";
import {CREATE_SHOP, GET_SHOPS, DELETE_SHOP, UPDATE_SHOP, GET_DOMAINS} from "~/lib/apollo/queries/shop";
import {SEARCH_POSITIONS} from "~/lib/apollo/queries/positions";
import {SEARCH_MODULES} from "~/lib/apollo/queries/modules";
import {SEARCH_CATEGORIES} from "~/lib/apollo/queries/categories";
import {SEARCH_SHOPS} from "~/lib/apollo/queries/shop";

export async function createShop(input) {
  try {
    return await graphQLClient.mutate({
      mutation: CREATE_SHOP,
      variables: {
        input
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)))
    console.log(JSON.parse(JSON.stringify(e.networkError.result)))
  }

  return null
}

export async function updateShop(patch) {
  try {
    return await graphQLClient.mutate({
      mutation: UPDATE_SHOP,
      variables: {
        patch
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    const err = JSON.parse(JSON.stringify(e))
    console.log(err)
    err.networkError && console.error(err.networkError.result.errors)
  }

  return null
}

export async function deleteShop(id) {
  try {
    return await graphQLClient.mutate({
      mutation: DELETE_SHOP,
      variables: {
        id
      },
      refetchQueries: [
        {query: GET_SHOPS},
      ],
    });
  } catch (e) {
    console.log(JSON.parse(JSON.stringify(e)))
  }

  return null
}

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
    return null
  }
}

export async function getDomains(userId, notUsed) {
  try {
    return await graphQLClient.query({
      query: GET_DOMAINS,
      variables: {
        userId,
        notUsed
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}

export async function searchPostions(query, limit) {
  try {
    return await newGraphQLClient().query({
      query: SEARCH_POSITIONS,
      variables: {
        query,
        limit,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}

export async function searchModules(query, limit) {
  try {
    return await newGraphQLClient().query({
      query: SEARCH_MODULES,
      variables: {
        query,
        limit,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}


export async function searchCategories(query, limit, userId) {
  try {
    return await newGraphQLClient().query({
      query: SEARCH_CATEGORIES,
      variables: {
        query,
        limit,
        userId,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}


export async function searchShops(query, limit, userId) {
  try {
    return await newGraphQLClient().query({
      query: SEARCH_SHOPS,
      variables: {
        query,
        limit,
        userId,
      },
    });
  } catch (e) {
    console.log(e)
    console.log(e.networkError.result)
    console.log(e.clientErrors.result)
    console.log(e.networkError.result)
    console.log(e.message.result)
    return null
  }
}