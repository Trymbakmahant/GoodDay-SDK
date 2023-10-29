import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { GET_NEXTID_INFO } from "./../graphql/queries";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://relation-service.nextnext.id/",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
});

export async function getGraph(platform: string, identity: string) {
  const error = ["there is some error"];
  console.log(platform, identity);
  try {
    const response = await client.query({
      query: GET_NEXTID_INFO,
      variables: {
        platform: platform,
        identity: identity,
      },
    });

    const data = response.data;
    if (data && data.identity && data.identity.neighbor[0]) {
      const id = data.identity.neighbor;
      console.log(data.identity.neighbor);
      for (let i = 0; i < id.length; i++) {
        if (id[i].identity.platform === "ethereum") {
          console.log(id[i].identity.identity);

          return id[i].identity.identity;
        }
      }
    }
    return error;
  } catch (e) {
    console.log(e);
  }
}
