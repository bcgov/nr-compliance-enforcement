import { ReactSearchAutocomplete } from 'react-search-autocomplete'

import { FC, useEffect, useRef } from "react";

interface Props {
  value?: string;
}

export const BCGeocoderAutocomplete: FC<Props> = ({value}) => {
  
  const items = [
    {
      id: 0,
      name: 'Cobol'
    },
    {
      id: 1,
      name: 'JavaScript'
    },
    {
      id: 2,
      name: 'Basic'
    },
    {
      id: 3,
      name: 'PHP'
    },
    {
      id: 4,
      name: 'Java'
    }
  ]
  
  return (
    <div style={{ width: 400 }}>
      <ReactSearchAutocomplete  items={items} />
    </div>
  );
};
