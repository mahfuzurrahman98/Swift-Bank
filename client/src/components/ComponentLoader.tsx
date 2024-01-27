import { ReactNode } from 'react';
import Error from '../pages/Error';
import { statusType } from '../types';
import Loading from './Loading';

// this componment will take status and the component to load
const ComponentLoader = ({
  status,
  component,
}: {
  status: statusType;
  component: ReactNode;
}) => {
  // console.log(status);
  return status.loading ? (
    <Loading />
  ) : status.error ? (
    <Error code={status.error} />
  ) : (
    component
  );
};

export default ComponentLoader;
