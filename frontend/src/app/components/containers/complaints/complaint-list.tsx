import { FC, useContext } from 'react';
import { ComplaintFilterContext } from '../../../providers/complaint-filter-provider';

export const ComplaintList: FC = () => { 
   const { resetFilters } = useContext(ComplaintFilterContext)
   
   return <>
      <button onClick={() => { 
         resetFilters();
      }}>derp</button>
   </>
}