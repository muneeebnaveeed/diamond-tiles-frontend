import React from 'react';
import { Button, Modal, Container, Spinner, ButtonGroup } from 'react-bootstrap';
import { When } from 'react-if';

const ModalWrapper = (props) => {
   const { show, onHide, isLoading, title, onSubmit, submitButtonText, children, isDisabled, ...rest } = props;
   return (
      <Modal className="fade" show={show} onHide={onHide} {...rest}>
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
            <ButtonGroup>
               <Button variant="warning light" onClick={onHide}>
                  Close
               </Button>
               <Button variant="primary" disabled={isLoading || isDisabled} onClick={onSubmit}>
                  <When condition={isLoading}>
                     <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  </When>
                  <span className="ml-1">{submitButtonText ?? 'Save changes'}</span>
               </Button>
            </ButtonGroup>
         </Modal.Footer>
      </Modal>
   );
};

export default ModalWrapper;
