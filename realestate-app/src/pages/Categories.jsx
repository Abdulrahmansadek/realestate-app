import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Categories() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          limit(10)
        );

        const querySnap = await getDocs(q);
        let listingsArr = [];
        querySnap.forEach((doc) => {
          return listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error("something went wrong");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="itemsContainer">
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <ul className="container mx-auto ">
            <div className="titleCategory container mx-auto">
              <div className="text-sm breadcrumbs">
                <ul>
                  {params.categoryName === "house" ? (
                    <li className="titleCategory">
                      <Link to={"/"}> Home </Link> / houses
                    </li>
                  ) : (
                    <li>
                      <Link to={"/"}>Home</Link> / apartments
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </>
      ) : (
        <p>no listings {params.categoryName}</p>
      )}
    </div>
  );
}

export default Categories;
