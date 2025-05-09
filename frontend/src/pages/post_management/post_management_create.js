import React from 'react';
import { Container } from 'react-bootstrap';
import PostForm from './Post_Form';

function PostManagementCreate() {
  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h4 className="mb-4">Create New Art Post</h4>
      <PostForm />
    </Container>
  );
}

export default PostManagementCreate;