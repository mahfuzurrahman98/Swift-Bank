import { Link } from 'react-router-dom';
import errors from '../lib/data/errors';
import { errorType } from '../types';

const Error = ({ code }: { code: number }) => {
  const error = errors.filter((err: errorType) => err.code === code)[0];
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700 text-white">
      <div className="rounded flex flex-col justify-center text-center">
        <h2 className="text-3xl font-semibold mb-4">
          {error.code} | {error.message}
        </h2>
        <p className="text-gray-200 mb-4">{error.description}</p>

        <Link
          to="/"
          className="flex justify-center items-center gap-x-2 bg-white  py-1 text-black rounded"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Error;
