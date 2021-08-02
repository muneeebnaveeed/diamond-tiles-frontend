import useUrlState from '@ahooksjs/use-url-state';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import { get, post, useAlert, useMutation } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { Else, If, Then } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';

const TypeActions = () => {
   const history = useHistory();
   const params = useParams();
   const [type, setType] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();

   const postMutation = useMutation((payload) => post('/types', payload), {
      onSuccess: () => {
         history.push('/types');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add type', err });
      },
   });

   const isViewtype = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddtype = useMemo(() => params?.id === 'add', [params.id]);
   const mutation = useMemo(() => postMutation, [postMutation]);

   if (!isViewtype && !isAddtype) {
      history.push('/types');
   }

   const formik = useFormik({
      initialValues: {
         title: '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   const fetchtypeData = async () => {
      let response;
      try {
         response = await get(`/types/${params.id}`);
         setType(response.data);
      } catch (err) {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage types.'] },
            callback: () => history.push('/types'),
            duration: 3000,
         });
      }
   };

   useEffect(() => {
      if (!isAddtype) {
         fetchtypeData();
      }
   }, []);

   return (
      <>
         <PageTItle activeMenu="types" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <If condition={isAddtype}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>Add New type</Card.Title>
                     </Card.Header>
                     <Card.Body>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Title</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="title"
                                 disabled={isError}
                                 value={formik.values.title}
                              />
                           </div>
                        </div>
                     </Card.Body>
                     <Card.Footer>
                        <div className="row">
                           <div className="col-xl-12 tw-justify-center">
                              <ButtonGroup>
                                 <Button
                                    icon={AiFillCaretLeft}
                                    variant="warning light"
                                    onClick={() => history.replace('/types')}
                                    loading={mutation.isLoading}
                                 >
                                    Back
                                 </Button>
                                 <Button
                                    icon={AiFillSave}
                                    variant="primary"
                                    type="submit"
                                    loading={mutation.isLoading}
                                    disabled={isError}
                                 >
                                    Save
                                 </Button>
                              </ButtonGroup>
                           </div>
                        </div>
                     </Card.Footer>
                  </form>
               </Then>
               <Else>
                  <Card.Header>
                     <Card.Title>View type</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Title</label>
                           <h4>{type?.title ?? 'N/A'}</h4>
                        </div>
                     </div>
                  </Card.Body>
                  <Card.Footer>
                     <div className="row">
                        <div className="col-xl-12 tw-justify-center">
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/types')}
                              loading={mutation.isLoading}
                           >
                              Back
                           </Button>
                        </div>
                     </div>
                  </Card.Footer>
               </Else>
            </If>
         </Card>
      </>
   );
};

export default TypeActions;
