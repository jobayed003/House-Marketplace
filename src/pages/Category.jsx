import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';
import ListingItem from './../components/ListingItem';

const Category = () => {
  const { categoryName } = useParams();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const listingsRef = collection(db, 'listings');

        // Create a query
        const q = query(
          listingsRef,
          where('type', '==', categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // Execute Query
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
      } catch {
        toast.error('Could not fetch listings');
      }
    };
    fetchListings();
  }, [categoryName]);

  return (
    <>
      <div className='category'>
        <header>
          <p className='pageHeader'>
            {categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
          </p>
        </header>

        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <main>
              <ul className='categoryListings'>
                {listings.map((listing) => (
                  <ListingItem
                    onDelete={'hi'}
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                  ></ListingItem>
                ))}
              </ul>
            </main>
          </>
        ) : (
          <p>No listings for {categoryName}</p>
        )}
      </div>
    </>
  );
};

export default Category;
