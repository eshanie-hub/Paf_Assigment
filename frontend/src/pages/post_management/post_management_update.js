import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PostForm from './Post_Form';

function PostManagementUpdate() {
  const { id } = useParams();
  
  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h4 className="mb-4">Edit Art Post</h4>
      <PostForm />
    </Container>
  );
}

export default PostManagementUpdate;