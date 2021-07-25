import React from 'react';

import EventCalendar from './EventCalendar';

import PageTitle from '../../../layouts/PageTitle';

const Calendar = () => (
   <div className="h-80">
      <PageTitle activeMenu="Calerdar" motherMenu="App" />

      <EventCalendar />
   </div>
);

export default Calendar;
