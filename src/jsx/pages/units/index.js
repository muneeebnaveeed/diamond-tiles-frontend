import useUrlState from '@ahooksjs/use-url-state';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import ModalWrapper from 'jsx/components/ModalWrapper';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, patch, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const Units = () => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [urlState, setUrlState] = useUrlState({});
   const [search, setSearch] = useState('');
   const [searchValue, setSearchValue] = useState('');

   const [showModal, setShowModal] = useState(false);
   const [selectedRow, setSelectedRow] = useState(null);

   const [title, setTitle] = useState('');
   const [value, setValue] = useState('');
   const [type, setType] = useState('');

   const alert = useAlert();

   const queryClient = useQueryClient();

   const query = useQuery(['units', page, limit, sort.field, sort.order, search], () =>
      get('/units', page, limit, sort.field, sort.order, search)
   );
   const getTypes = useQuery('types', () => get('/types'));
   const deleteMutation = useMutation((id) => del(`/units/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('units');
         alert.setAlert({
            message: 'Unit deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete Unit', err });
      },
   });
   const patchMutation = useMutation((payload) => patch(`/units/id/${selectedRow._id}`, payload), {
      onSuccess: () => {
         setShowModal(false);
         setUrlState({});
         query.refetch();
      },
      onError: (err) => {
         alert.setErrorAlert({
            message: 'Unable to edit unit.',
            err,
         });
      },
   });

   const postMutation = useMutation((payload) => post('/units', payload), {
      onSuccess: () => {
         setShowModal(false);
         setUrlState({});
         query.refetch();
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add unit', err });
      },
   });

   const isEditing = useMemo(() => urlState?.action === 'edit', [urlState.action]);
   const isAdd = useMemo(() => urlState?.action === 'add', [urlState.action]);
   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   const handleOnClickEdit = (obj) => {
      setSelectedRow(obj);
      setShowModal(true);
      setUrlState({ action: 'edit' });
      setTitle(obj.title);
      setValue(obj.value);
      setType(obj.type?._id ?? getTypes.data[0]._id);
      console.log(obj.type?._id ?? getTypes.data[0]._id);
   };

   const handleOnClickView = (obj) => {
      history.push({ pathname: `/units/${obj._id}`, search: `?type=view` });
   };
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

   const alertMarkup = alert.getAlert();
   const handleSort = (key) => {
      setSort((prev) => ({ field: key, order: prev.order * -1 }));
   };

   const handleSubmit = () => {
      mutation.mutate({ title, value, type });
   };

   const handleSearch = () => {
      setSearch(searchValue);
   };

   useEffect(() => {
      if (searchValue === '') {
         setSearch('');
      }
   }, [searchValue]);

   useEffect(() => {
      if (getTypes.data?.length > 0) {
         setType(getTypes.data[0]._id);
      }
   }, [getTypes.data]);

   useEffect(() => {
      if (isAdd) {
         setShowModal(true);
         setTitle('');
         setValue('');
         // setType('');
      }
   }, [isAdd]);

   return (
      <>
         <PageTItle activeMenu="units" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Unit
               </Button>
            </div>

            <div className="col-xl-6">
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6"
                     placeholder="Search units..."
                     disabled={deleteMutation.isLoading}
                     onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                     variant="secondary"
                     className="btn btn-secondary tw-pl-6"
                     onClick={handleSearch}
                     loading={deleteMutation.isLoading}
                  >
                     Search
                  </Button>
               </ButtonGroup>
            </div>
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
                     <Card.Title>Manage units</Card.Title>
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('title')}>
                                          TITLE
                                          <If condition={sort.order === 1 && sort.field === 'title'}>
                                             <Then>
                                                <span>
                                                   <FaSortDown className="d-inline mx-1" />
                                                </span>
                                             </Then>
                                             <Else>
                                                <span>
                                                   <FaSortUp className="d-inline mx-1" />
                                                </span>
                                             </Else>
                                          </If>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('value')}>
                                          VALUE
                                          <If condition={sort.order === 1 && sort.field === 'value'}>
                                             <Then>
                                                <span>
                                                   <FaSortDown className="d-inline mx-1" />
                                                </span>
                                             </Then>
                                             <Else>
                                                <span>
                                                   <FaSortUp className="d-inline mx-1" />
                                                </span>
                                             </Else>
                                          </If>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('type')}>
                                          TYPE
                                          <If condition={sort.order === 1 && sort.field === 'type'}>
                                             <Then>
                                                <span>
                                                   <FaSortDown className="d-inline mx-1" />
                                                </span>
                                             </Then>
                                             <Else>
                                                <span>
                                                   <FaSortUp className="d-inline mx-1" />
                                                </span>
                                             </Else>
                                          </If>
                                       </strong>
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
                                       <td>{e.value}</td>
                                       <td>{(e.type && e.type?.title) ?? 'N/A'}</td>
                                       <td>
                                          <OverlayTrigger
                                             trigger="hover"
                                             placement="top"
                                             overlay={
                                                <Popover>
                                                   <Popover.Content>{`Created by ${e.createdBy ?? 'N/A'} ${
                                                      dayjs(e.createdAt).diff(dayjs(), 'day', true) > 1
                                                         ? `at ${dayjs(e.createdAt).format('DD-MMM-YYYY')}`
                                                         : dayjs(e.createdAt).fromNow()
                                                   }.`}</Popover.Content>
                                                </Popover>
                                             }
                                          >
                                             <AiOutlineQuestionCircle />
                                          </OverlayTrigger>
                                       </td>
                                       <td>
                                          <ButtonGroup>
                                             <Button
                                                variant="dark"
                                                size="sm"
                                                icon={AiFillEye}
                                                onClick={() => handleOnClickView(e)}
                                             >
                                                View
                                             </Button>
                                             <Button
                                                variant="warning"
                                                size="sm"
                                                icon={AiFillEdit}
                                                onClick={() => handleOnClickEdit(e)}
                                             >
                                                Edit
                                             </Button>
                                             <Button
                                                variant="danger"
                                                size="sm"
                                                icon={AiFillDelete}
                                                onClick={() => handleOnClickDelete(e._id)}
                                             >
                                                Delete
                                             </Button>
                                          </ButtonGroup>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <p className="tw-m-0">No units created</p>
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
               {..._.omit(query.data, ['docs'])}
               isLimitDisabled={query.isLoading || deleteMutation.isLoading}
            />
         </When> */}
         {/* ADD EDIT */}
         <ModalWrapper
            show={showModal}
            onHide={() => {
               setShowModal(false);
               setUrlState({});
            }}
            title={isEditing ? 'Edit Unit' : 'Add New Unit'}
            isLoading={query.isLoading || postMutation.isLoading || patchMutation.isLoading}
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
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-6">
                     <label className="col-form-label">Value</label>
                     <input
                        className="form-control"
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                        name="value"
                        value={value}
                     />
                  </div>
               </div>
            </form>
            <div className="row">
               <div className="form-group col-xl-6">
                  <label className="col-form-label">Type</label>
                  <select
                     className="form-control form-control-lg"
                     id="inlineFormCustomSelect"
                     onChange={(e) => setType(e.target.value)}
                     value={type}
                     name="type"
                  >
                     {getTypes.data?.map((e) => (
                        <option key={e._id} selected={e._id === selectedRow?.type} value={e._id}>
                           {e.title}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
         </ModalWrapper>
      </>
   );
};

export default Units;
