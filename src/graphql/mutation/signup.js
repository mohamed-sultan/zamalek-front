import gql from "graphql-tag";
export const SIGNUP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!, $userName: String!) {
    signup(email: $email, password: $password, userName: $userName) {
      token
    }
  }
`;
