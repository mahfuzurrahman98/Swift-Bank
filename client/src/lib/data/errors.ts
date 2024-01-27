import { errorType } from '../../types';

const errors: errorType[] = [
  {
    code: 400,
    message: 'Bad Request',
    description:
      'The server could not understand the request due to invalid syntax.',
  },
  {
    code: 403,
    message: 'Forbidden',
    description: 'You are not authorized to access the resource',
  },
  {
    code: 404,
    message: 'Not Found',
    description: 'The page you are looking for is not valid.',
  },
  {
    code: 500,
    message: 'Internal Server Error',
    description:
      'The server has encountered an error and cannot complete the request.',
  },
];

export default errors;
