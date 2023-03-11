import React from "react";
import {Jumbotron, Container, CardColumns, Card, Button} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";

import Auth from "../utils/auth";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";



const SavedBooks = () => {
  // useQuery HOOK to execute the GET_ME query on load

  const { loading, data } = useQuery(GET_ME);
  // useMutation HOOK (SHOULD ERROR BE REMOVED FROM THIS?)

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // data?.me CHECKS IF DATA EXISTS, OTHERWISE RETURN AN EMPTY OBJECT
  const userData = data?.me || {};

  // function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {

    // create token variable to hold the token value from localStorage, null if there is no token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // if the token exists, run removeBook mutation
    if (!token) {
      return false;
    }

    // try/catch to handle errors from removeBook mutation
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"
            }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;