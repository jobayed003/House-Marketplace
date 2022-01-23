import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  //  eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const { landlordId } = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', landlordId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data');
      }
    };
    getLandlord();
  }, [landlordId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>
              Contact {landlord?.name}
            </p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label
                htmlFor='message'
                className='messageLabel'
              >
                Message
              </label>
              <textarea
                name='name'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${
                landlord.email
              }?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button
                type='button'
                className='primaryButton'
              >
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
