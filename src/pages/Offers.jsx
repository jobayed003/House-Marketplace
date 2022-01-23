import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';
import ListingItem from './../components/ListingItem';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] =
    useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const listingsRef = collection(db, 'listings');

        // Create a query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // Execute Query
        const querySnap = await getDocs(q);

        const lastVisible =
          querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch {
        toast.error('Could not fetch listings');
      }
    };
    fetchListings();
  }, []);

  // Pagination load more

  const onFetchedMoreListings = async () => {
    try {
      // Get Reference
      const listingsRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute Query
      const querySnap = await getDocs(q);

      const lastVisible =
        querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [
        ...prevState,
        ...listings,
      ]);
      setLoading(false);
    } catch {
      toast.error('Could not fetch listings');
    }
  };
  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  // onDelete={'hi'}
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                ></ListingItem>
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p
              className='loadMore'
              onClick={onFetchedMoreListings}
            >
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are not current offers</p>
      )}
    </div>
  );
};

export default Offers;
