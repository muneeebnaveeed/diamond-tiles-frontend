import useUrlState from '@ahooksjs/use-url-state';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import ModalWrapper from 'jsx/components/ModalWrapper';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillPlusCircle, AiOutlineQuestionCircle, AiFillEye } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { userRoles } from 'jsx/helpers/enums';
import CreatableSelect from '../../components/CreatableSelect';

const Units = (props) => {
   const history = useHistory();
   dayjs.extend(relativeTime);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [urlState, setUrlState] = useUrlState({});
   const [search, setSearch] = useState('');

   const [showModal, setShowModal] = useState(false);
   const [selectedRow, setSelectedRow] = useState(null);

   const alert = useAlert();

   const queryClient = useQueryClient();

   const query = useQuery(['units', page, limit, search], () => get('/units', page, limit, '', '', search));
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
   const postTypeMutation = useMutation((payload) => post('/types', payload), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('types');
      },
   });

   const isAdd = useMemo(() => urlState?.action === 'add', [urlState.action]);
   const mutation = useMemo(() => postMutation, [postMutation]);

   const formik = useFormik({
      initialValues: {
         title: '',
         value: '',
         type: '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   const handleOnClickAdd = () => {
      setShowModal(true);
      formik.setFieldValue('title', '');
      formik.setFieldValue('value', '');
      formik.setFieldValue('type', '');
      // setUrlState({ action: 'add' });
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
   const handleOnClickView = (id) => {
      history.push(`/products/units/${id}`);
   };

   const handleCreateType = (title) => {
      postTypeMutation.mutate({ title });

      // history.push({ pathname: '/types', search: `?action=add&title=${title}&redirect=/units?action=add` });
   };

   const alertMarkup = alert.getAlert();

   return (
      <>
         {/* <PageTItle activeMenu="units" motherMenu="Manage" /> */}
         {/* <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Unit
               </Button>
            </div>
         </div> */}
         {alertMarkup ? (
            <Row>
               <Col lg={12}>{alertMarkup}</Col>
            </Row>
         ) : null}
         <Card className="h-100">
            <When condition={query.isLoading || deleteMutation.isLoading}>
               <SpinnerOverlay />
            </When>
            <Card.Header>
               <Card.Title>Manage units</Card.Title>
               <Button size="sm" variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Unit
               </Button>
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
                                 <strong className="tw-cursor-pointer">TITLE</strong>
                              </th>
                              <th>
                                 <strong className="tw-cursor-pointer">VALUE</strong>
                              </th>
                              <th>
                                 <strong className="tw-cursor-pointer">TYPE</strong>
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
                                 <When condition={props.user?.role !== userRoles.CASHIER}>
                                    <td>
                                       <Button
                                          variant="danger"
                                          size="sm"
                                          icon={AiFillDelete}
                                          onClick={() => handleOnClickDelete(e._id)}
                                       />
                                    </td>
                                 </When>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </Then>
                  <Else>
                     <When condition={!query.isLoading}>
                        <p className="tw-m-0">No units created</p>
                     </When>
                  </Else>
               </If>
            </Card.Body>
         </Card>

         {/* ADD Modal */}
         <ModalWrapper
            show={showModal}
            onHide={() => {
               setShowModal(false);
               setUrlState({});
            }}
            title="Add New Unit"
            isLoading={query.isLoading || postMutation.isLoading}
            size="md"
            onSubmit={formik.handleSubmit}
            submitButtonText="Confirm"
         >
            <When condition={getTypes.isLoading}>
               <SpinnerOverlay />
            </When>
            <form onSubmit={formik.handleSubmit}>
               <div className="row">
                  <div className="form-group col-xl-6">
                     <label className="col-form-label">Title</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="title"
                        value={formik.values.title}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-6">
                     <label className="col-form-label">Value</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="value"
                        value={formik.values.value}
                     />
                  </div>
                  <button type="submit" className="tw-invisible" />
               </div>
            </form>
            <div className="row">
               <div className="form-group col-xl-6">
                  <label className="col-form-label">Type</label>
                  <CreatableSelect
                     isClearable
                     onChange={(e) => formik.setFieldValue('type', e?._id)}
                     options={
                        getTypes.data?.length > 0 &&
                        getTypes.data.map((e) => ({ ...e, label: e.title, value: e.title }))
                     }
                     onCreateOption={handleCreateType}
                  />
               </div>
            </div>
         </ModalWrapper>
      </>
   );
};
const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Units));
