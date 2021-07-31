import React from 'react';
import { Button, Modal, Container, Spinner } from 'react-bootstrap';
import { When } from 'react-if';

const ModalWrapper = (props) => {
   const { show, onHide, isLoading, title, onSubmit, submitButtonText, children, ...rest } = props;
   return (
      <Modal className="fade" show={show} {...rest}>
         <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Button variant="" className="close" onClick={onHide}>
               <span>&times;</span>
            </Button>
         </Modal.Header>
         <Modal.Body>
            <Container>{children}</Container>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="danger light" onClick={onHide}>
               Close
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={onSubmit}>
               <When condition={isLoading}>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
               </When>
               <span className="ml-1">{submitButtonText ?? 'Save changes'}</span>
            </Button>
         </Modal.Footer>
      </Modal>
   );
};

export default ModalWrapper;
