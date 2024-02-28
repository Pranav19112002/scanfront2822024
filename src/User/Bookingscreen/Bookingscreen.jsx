import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import axios from 'axios';
import Swal from 'sweetalert2';

const Bookingscreen = () => {
  const { id, name ,type, amount } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scan, setScan] = useState(null);
  const [totalamount, setTotalamount] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3500/scans/getscanbyid/${id}`);
        const updatedScan = {
          ...response.data,
          imageUrl: `data:${response.data.scanImageURL.contentType};base64,${response.data.scanImageURL.data}`
        };
        setScan(updatedScan);
        setTotalamount(updatedScan.samount);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  async function onBookNow() {
    try {
      setLoading(true);
      // Assuming you have an API endpoint to handle booking scans
      const result = await axios.post('http://localhost:3500/book/bookscan', {
        scanId: id,
        scanName: scan.sname, // Pass the scan name
        scanType: scan.stype, // Pass the scan type
        totalAmount: totalamount,
        // Add additional booking details here if needed
      });
            // Add additional booking details here if needed

      setLoading(false);
      Swal.fire("Success", "Scan has been booked successfully!", "success").then(result => {
        window.location.href = '/profile';
      });
    } catch (error) {
      setLoading(false);
      Swal.fire('Error', "Failed to book scan. Please try again later.", "error");
    }
  }

  return (
    <div className='m-5'>
      {loading ? (
        <h1 className='text-center'><Loader /></h1>
      ) : error ? (
        <Error />
      ) : (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-4">
              <div className="text-left">
                <h1>{scan.sname}</h1>
                <img src={scan.imageUrl} className='bigimg' alt="Scan Preview" />
              </div>
            </div>
            <div className="col-md-8"> {/* Changed col-md-6 to col-md-8 */}
              <div style={{ textAlign: 'left' }}> {/* Changed textAlign to 'left' */}
                <b>
                  <h1>Booking Details</h1>
                  <hr />
                  <p>Scan Name : {scan.sname} </p>
                  {/* Modify these details according to your scan data */}
                  <p>Scan Type: {scan.stype}</p>
                  
                  {/* Display other scan details if needed */}
                  <h1>Amount: {scan.amount}</h1>
                  <hr />
                  <p>Total Amount: {totalamount}</p>
                </b>
              </div>
              <div style={{ float: 'right' }}>
                <button className='btn btn-primary' onClick={onBookNow}>Book Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookingscreen;
