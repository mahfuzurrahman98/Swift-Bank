import './App.css';
import { AuthContextProvider } from './contexts/AuthContext';
import Router from './router';

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};

export default App;
