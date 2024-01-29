import { Link } from 'react-router-dom';

const MessageDiv = () => {
    // give a good message and show a link to login
    return (
        <div className="p-3 lg:p-12 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold">Welcome,</h1>
            <p className="text-lg">
                You are not logged in. Please{' '}
                <span className="text-amber-800 underline">
                    <Link to="/login">login</Link>
                </span>{' '}
                to proceed.
            </p>
        </div>
    );
};

export default MessageDiv;
