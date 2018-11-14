import gql from "graphql-tag";

export const getPlayers = gql`
  {
    getPlayers {
      _id
      name
      shortName
      bio
      image
      rating
      reviews {
        title
        content
        _id
        rating
        user {
          userName
        }
        createdAt
      }
      videos {
        title
        uri
      }
      nationality
      teams
      createdAt
    }
  }
`;
