import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import DropFile from './DropFile';

import PageTitle from '../../../../layouts/PageTitle';

const Compose = () => (
   <>
      <PageTitle activeMenu="Compose" motherMenu="Email" />

      <div className="row">
         <div className="col-lg-12">
            <div className="card">
               <div className="card-body">
                  <div className="email-left-box px-0 mb-3">
                     <div className="p-0">
                        <Link to="/email-compose" className="btn btn-primary btn-block">
                           Compose
                        </Link>
                     </div>
                     <div className="mail-list mt-4">
                        <Link to="/email-inbox" className="list-group-item active">
                           <i className="fa fa-inbox font-18 align-middle mr-2" />
                           Inbox
                           <span className="badge badge-primary badge-sm text-white float-right">198</span>
                        </Link>
                        <Link to="/email-compose" className="list-group-item">
                           <i className="fa fa-paper-plane font-18 align-middle mr-2" />
                           Sent
                        </Link>
                        <Link to="/email-compose" className="list-group-item">
                           <i className="fa fa-star-o font-18 align-middle mr-2" />
                           Important
                           <span className="badge badge-danger text-white badge-sm float-right">47</span>
                        </Link>
                        <Link to="/email-compose" className="list-group-item">
                           <i className="mdi mdi-file-document-box font-18 align-middle mr-2" />
                           Draft
                        </Link>
                        <Link to="/email-compose" className="list-group-item">
                           <i className="fa fa-trash font-18 align-middle mr-2" />
                           Trash
                        </Link>
                     </div>
                     <div className="intro-title d-flex justify-content-between">
                        <h5>Categories</h5>
                        <i className="fa fa-chevron-down" aria-hidden="true" />
                     </div>
                     <div className="mail-list mt-4">
                        <Link to="/email-inbox" className="list-group-item">
                           <span className="icon-warning">
                              <i className="fa fa-circle" aria-hidden="true" />
                           </span>
                           Work
                        </Link>
                        <Link to="/email-inbox" className="list-group-item">
                           <span className="icon-primary">
                              <i className="fa fa-circle" aria-hidden="true" />
                           </span>
                           Private
                        </Link>
                        <Link to="/email-inbox" className="list-group-item">
                           <span className="icon-success">
                              <i className="fa fa-circle" aria-hidden="true" />
                           </span>
                           Support
                        </Link>
                        <Link to="/email-inbox" className="list-group-item">
                           <span className="icon-dpink">
                              <i className="fa fa-circle" aria-hidden="true" />
                           </span>
                           Social
                        </Link>
                     </div>
                  </div>
                  <div className="email-right-box ml-0 ml-sm-4 ml-sm-0">
                     <div className="toolbar mb-4" role="toolbar">
                        <div className="btn-group mb-1">
                           <button type="button" className="btn btn-primary light px-3">
                              <i className="fa fa-archive" />
                           </button>
                           <button type="button" className="btn btn-primary light px-3">
                              <i className="fa fa-exclamation-circle" />
                           </button>
                           <button type="button" className="btn btn-primary light px-3">
                              <i className="fa fa-trash" />
                           </button>
                        </div>
                        <Dropdown className="btn-group mb-1">
                           <Dropdown.Toggle
                              type="button"
                              className="btn btn-primary light dropdown-toggle px-3 ml-1"
                              data-toggle="dropdown"
                           >
                              <i className="fa fa-folder" />
                              <b className="caret m-l-5" />
                           </Dropdown.Toggle>
                           <Dropdown.Menu className="dropdown-menu">
                              <Dropdown.Item as="a" className="dropdown-item" to="/email-compose">
                                 Social
                              </Dropdown.Item>
                              <Dropdown.Item as="a" className="dropdown-item" to="/email-compose">
                                 Promotions
                              </Dropdown.Item>
                              <Dropdown.Item as="a" className="dropdown-item" to="/email-compose">
                                 Updates
                              </Dropdown.Item>
                              <Dropdown.Item as="a" className="dropdown-item" to="/email-compose">
                                 Forums
                              </Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="btn-group mb-1">
                           <Dropdown.Toggle
                              className="btn btn-primary light dropdown-toggle px-3 ml-1"
                              data-toggle="dropdown"
                           >
                              <i className="fa fa-tag" />
                           </Dropdown.Toggle>
                           <Dropdown.Menu>
                              <Dropdown.Item as="a">Updates</Dropdown.Item>
                              <Dropdown.Item as="a">Social</Dropdown.Item>
                              <Dropdown.Item as="a">Promotions</Dropdown.Item>
                              <Dropdown.Item as="a">Forums</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="btn-group mb-1">
                           <Dropdown.Toggle
                              type="button"
                              className="btn btn-primary light dropdown-toggle v ml-1"
                              data-toggle="dropdown"
                           >
                              More <span className="caret m-l-5" />
                           </Dropdown.Toggle>
                           <Dropdown.Menu className="dropdown-menu">
                              <Dropdown.Item className="dropdown-item" to="/email-compose">
                                 Mark as Unread
                              </Dropdown.Item>
                              <Dropdown.Item className="dropdown-item" to="/email-compose">
                                 Add to Tasks
                              </Dropdown.Item>
                              <Dropdown.Item className="dropdown-item" to="/email-compose">
                                 Add Star
                              </Dropdown.Item>
                              <Dropdown.Item className="dropdown-item" to="/email-compose">
                                 Mute
                              </Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </div>
                     <div className="compose-content">
                        <form action="#">
                           <div className="form-group">
                              <input type="text" className="form-control bg-transparent" placeholder=" To:" />
                           </div>
                           <div className="form-group">
                              <input type="text" className="form-control bg-transparent" placeholder=" Subject:" />
                           </div>
                           <div className="form-group">
                              <textarea
                                 id="email-compose-editor"
                                 className="textarea_editor form-control bg-transparent"
                                 rows="15"
                                 placeholder="Enter text ..."
                              />
                           </div>
                        </form>
                        <h5 className="mb-4">
                           <i className="fa fa-paperclip" /> Attatchment
                        </h5>
                        <DropFile />
                     </div>
                     <div className="text-left mt-4 ">
                        <button className="btn btn-primary btn-sl-sm mr-2" type="button">
                           <span className="mr-2">
                              <i className="fa fa-paper-plane" />
                           </span>
                           Send
                        </button>
                        <button className="btn btn-danger light btn-sl-sm" type="button">
                           <span className="mr-2">
                              <i className="fa fa-times" aria-hidden="true" />
                           </span>
                           Discard
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </>
);

export default Compose;
