import {
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import PrivateRoutes from './components/PrivateRoutes';
import Category from './pages/Category';
import Contact from './pages/Contact';
import CreateListing from './pages/CreateListing';
import Explore from './pages/Explore';
import ForgotPass from './pages/ForgotPass';
import Listing from './pages/Listing';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Explore />}
        />
        <Route
          path='/profile'
          element={<PrivateRoutes />}
        >
          <Route
            path='/profile'
            element={<Profile />}
          />
        </Route>
        <Route
          path='/offers'
          element={<Offers />}
        />
        <Route
          path='/category/:categoryName'
          element={<Category />}
        />
        <Route
          path='/sign-in'
          element={<SignIn />}
        />
        <Route
          path='/sign-up'
          element={<SignUp />}
        />
        <Route
          path='/forgot-password'
          element={<ForgotPass />}
        />
        <Route
          path='/create-listing'
          element={<CreateListing />}
        />

        <Route
          path='/category/:categoryName/:listingId'
          element={<Listing />}
        />
        <Route
          path='/contact/:landlordId'
          element={<Contact />}
        />
      </Routes>
      <NavBar />
      <ToastContainer />
    </>
  );
};

export default App;
