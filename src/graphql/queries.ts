import { gql } from '@apollo/client';

export const GET_NEXTID_INFO = gql`
  query findOneIdentityWithSource($platform: String!, $identity: String!) {
    identity(platform: $platform, identity: $identity) {
      uuid
      platform
      identity
      displayName
      # Here we perform a 100-depth deep search for this identity's "neighbor".
      neighbor(depth: 100) {
        # Which upstreams provide these connection infos.
        identity {
          uuid
          platform
          identity
          displayName
        }
      }
    }
  }
`;
