// import gql from apollo
import { gql } from "@apollo/client";

// export - get me
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;