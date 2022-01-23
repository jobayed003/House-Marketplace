import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import homeIcon from '../assets/svg/homeIcon.svg';
import arroRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import ListingItem from '../components/ListingItem';
import { db } from './../firebase.config';

const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState(null);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // updateDoc();

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListing = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListing();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display Name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(
          db,
          'users',
          auth.currentUser.uid
        );

        await updateDoc(userRef, {
          name,
          email,
        });
      }

      toast.success('Successfully updated details!');
    } catch (err) {
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to delete?')
    ) {
      await deleteDoc(doc(db, 'listings', id));
      const updatedListings = listings.filter(
        (listing) => listing.id !== id
      );
      setListings(updatedListings);
      toast.success('Successfully deleted listing!');
    }

    deleteDoc();
  };

  const onUpdate = (id) =>
    navigate(`/update-listing/${id}`);

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button
          className='logOut'
          type='button'
          onClick={onLogout}
        >
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>
            Personal Details
          </p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevstate) => !prevstate);
            }}
          >
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? 'profileName'
                  : 'profileNameActive'
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='email'
              id='email'
              className={
                !changeDetails
                  ? 'profileEmail'
                  : 'profileEmailActive'
              }
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link
          to='/create-listing'
          className='createListing'
        >
          <img src={homeIcon} alt='home' />
          <p>Sell or Rent your home</p>
          <img src={arroRightIcon} alt='arrowright' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onUpdate={() => onUpdate(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
