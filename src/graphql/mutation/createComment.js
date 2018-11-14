import gql from "graphql-tag";

export const CREATE_REVIEW_MUTATION = gql`
  mutation createComment(
    $playerId: String!
    $rating: String!
    $title: String!
    $content: String!
  ) {
    createComment(
      playerId: $playerId
      rating: $rating
      title: $title
      content: $content
    ) {
      title
      content
      _id
      rating
      user {
        userName
      }
      createdAt
    }
  }
`;
