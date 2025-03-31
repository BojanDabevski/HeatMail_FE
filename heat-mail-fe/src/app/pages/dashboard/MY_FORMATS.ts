import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY', // Input format for parsing
  },
  display: {
    dateInput: 'MM/YYYY', // Input format for displaying
    monthYearLabel: 'MMM YYYY', // Format for month-year label in calendar
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
