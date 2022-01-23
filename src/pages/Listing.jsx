import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { Link, useParams } from 'react-router-dom';
import SwiperCore, {
  A11y,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import shareIcon from '../assets/svg/shareIcon.svg';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] =
    useState(false);

  const { listingId } = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', listingId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {listing.imageUrls.map((url, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                background: `url(${url}) center  no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.href
          );
          setShareLinkCopied(true);

          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='share icon' />
      </div>
      {shareLinkCopied && (
        <p className='linkCopied'>
          Link Copied To Clipboard!
        </p>
      )}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularePrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>

        <p className='listingLocation'>
          {listing.location}
        </p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            $
            {listing.regularPrice - listing.discountedPrice}{' '}
            discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>

          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100' }}
            center={[
              listing.geolocation.lat,
              listing.geolocation.long,
            ]}
            zoom={13}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
              position={[
                listing.geolocation.lat,
                listing.geolocation.long,
              ]}
              zoom={13}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
