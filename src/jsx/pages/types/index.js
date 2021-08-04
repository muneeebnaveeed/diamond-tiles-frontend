import useUrlState from '@ahooksjs/use-url-state';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery, post } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useState, useMemo, useEffect } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';
import ModalWrapper from 'jsx/components/ModalWrapper';
import { useHistory } from 'react-router-dom';

const Types = () => {
   const history = useHistory();
   dayjs.extend(relativeTime);
   const [urlState, setUrlState] = useUrlState({});

   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [search, setSearch] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [title, setTitle] = useState('');

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['types', page, limit, search], () => get('/types', page, limit, '', '', search));
   const postMutation = useMutation((payload) => post('/types', payload), {
      onSuccess: () => {
         if (urlState.redirect) {
            history.replace(urlState.redirect);
         }
         setShowModal(false);
         query.refetch();
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add unit', err });
      },
   });
   const deleteMutation = useMutation((id) => del(`/types/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('types');
         alert.setAlert({
            message: 'Type deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete Type', err });
      },
   });

   const isAdd = useMemo(() => urlState?.action === 'add', [urlState.action]);
   const mutation = useMemo(() => postMutation, [postMutation]);

   const handleOnClickAdd = () => {
      setShowModal(true);
      setUrlState({ action: 'add' });
   };

   const handleOnClickDelete = (id) => {
      swal({
         title: 'Are you sure?',
         text: 'Once deleted, you will not be able to recover it!',
         icon: 'warning',
         buttons: true,
         dangerMode: true,
      }).then((willDelete) => {
         if (willDelete) {
            deleteMutation.mutate(id);
         }
      });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate({ title });
   };
   const alertMarkup = alert.getAlert();
   useEffect(() => {
      if (isAdd) {
         setShowModal(true);
         setTitle(urlState.title ?? '');
      }
   }, [isAdd]);
   return (
      <>
         <PageTItle activeMenu="types" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Type
               </Button>
            </div>

            {/* <div className="col-xl-6">
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6"
                     placeholder="Search types..."
                     disabled={deleteMutation.isLoading}
                     onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="secondary" className="btn btn-secondary tw-pl-6" loading={query.isLoading}>
                     Search
                  </Button>
               </ButtonGroup>
            </div> */}
         </div>
         {alertMarkup ? (
            <Row>
               <Col lg={12}>{alertMarkup}</Col>
            </Row>
         ) : null}
         <div className="row">
            <Col lg={12}>
               <Card>
                  <When condition={query.isLoading || deleteMutation.isLoading}>
                     <SpinnerOverlay />
                  </When>
                  <Card.Header>
                     <Card.Title>Manage types</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <If condition={query.data?.length > 0}>
                        <Then>
                           <Table className="tw-relative" responsive>
                              <thead>
                                 <tr>
                                    <th className="width80">
                                       <strong>#</strong>
                                    </th>
                                    <th>
                                       <strong>TITLE</strong>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data?.map((e, index) => (
                                    <tr key={`${e._id}`}>
                                       <td>
                                          <strong>{index + 1}</strong>
                                       </td>
                                       <td>{e.title}</td>
                                       <td>
                                          <OverlayTrigger
                                             trigger={['hover', 'hover']}
                                             placement="top"
                                             overlay={
                                                <Popover className="tw-border-gray-500">
                                                   <Popover.Content>{`Created by ${e.createdBy ?? 'N/A'} ${
                                                      dayjs(e.createdAt).diff(dayjs(), 'day', true) > 7
                                                         ? `at ${dayjs(e.createdAt).format('DD-MMM-YYYY')}`
                                                         : dayjs(e.createdAt).fromNow()
                                                   }.`}</Popover.Content>
                                                </Popover>
                                             }
                                          >
                                             <AiOutlineQuestionCircle className="tw-cursor-pointer" />
                                          </OverlayTrigger>
                                       </td>
                                       <td>
                                          <ButtonGroup>
                                             <Button
                                                variant="danger"
                                                size="sm"
                                                icon={AiFillDelete}
                                                onClick={() => handleOnClickDelete(e._id)}
                                             />
                                          </ButtonGroup>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <When condition={!query.isLoading}>
                              <p className="tw-m-0">No types created</p>
                           </When>
                        </Else>
                     </If>
                  </Card.Body>
               </Card>
            </Col>
         </div>
         {/* <When condition={limit > 5 ? true : query.data?.totalPages > 1}>
            <Pagination
               page={page}
               onPageChange={setPage}
               onLimitChange={setLimit}
               {..._.omit(query.data)}
               isLimitDisabled={query.isLoading || deleteMutation.isLoading}
            />
         </When> */}
         <ModalWrapper
            show={showModal}
            onHide={() => {
               setShowModal(false);
               setUrlState({});
            }}
            title="Add New Unit"
            isLoading={query.isLoading || postMutation.isLoading}
            size="md"
            onSubmit={handleSubmit}
            submitButtonText="Confirm"
         >
            <form onSubmit={handleSubmit}>
               <div className="row">
                  <div className="form-group col-xl-6">
                     <label className="col-form-label">Title</label>
                     <input
                        className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        name="title"
                        value={title}
                     />
                     <button type="submit" className="tw-invisible" />
                  </div>
               </div>
            </form>
         </ModalWrapper>
      </>
   );
};

export default Types;
