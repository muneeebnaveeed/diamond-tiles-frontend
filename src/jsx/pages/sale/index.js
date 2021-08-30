import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import produce from 'immer';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, getV2, useAlert, useMutation, useQuery } from 'jsx/helpers';
import { userRoles } from 'jsx/helpers/enums';
import getSortingIcon from 'jsx/helpers/getSortingIcon';
import PageTItle from 'jsx/layouts/PageTitle';
import _, { isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import ClearSale from './ClearSale';
import RefundSale from './RefundSale';
import ManageSales from './MangeSales';

const Sale = (props) => {
   const history = useHistory();

   const alert = useAlert();

   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());

   const handleOnClickAdd = () => {
      history.push('/sale/add');
   };

   const alertMarkup = alert.getAlert();

   return (
      <>
         <PageTItle activeMenu="Sale" motherMenu="Diamond Tiles" />

         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Sale
               </Button>
            </div>
            <div className="col-xl-6 tw-flex tw-justify-end tw-items-center">
               <ReactDatePicker selected={startDate} onChange={(d) => setStartDate(d)} dateFormat="dd MMMM yyyy" />
               <span className="mx-4">to</span>
               <ReactDatePicker selected={endDate} onChange={(d) => setEndDate(d)} dateFormat="dd MMMM yyyy" />
            </div>
         </div>
         {alertMarkup ? (
            <Row>
               <Col lg={12}>{alertMarkup}</Col>
            </Row>
         ) : null}
         <div className="row">
            <Col lg={12}>
               <ManageSales startDate={startDate} endDate={endDate} />
            </Col>
         </div>
      </>
   );
};

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Sale);
