import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import axios from 'axios';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import { Link } from 'react-router-dom';

function Scans() {
  const [scans, setScans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3500/scans/getallscans');
        const updatedScans = response.data.map(scan => {
          if (scan.scanImageURL) {
            return { 
              ...scan, 
              imageUrl: `data:${scan.scanImageURL.contentType};base64,${scan.scanImageURL.data}`
            };
          }
          return scan;
        });
        setScans(updatedScans);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch scans');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter scans based on the display property
  const filteredScans = scans.filter(scan => scan.display !== false);

  return (
    <Layout>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {loading && <Loader />}
        {error && <Error />}
        {filteredScans.map((scan, index) => (
          <Card key={index} sx={{ width: "400px", margin: 2 }}>
            <CardActionArea>
              <CardMedia
                sx={{ minHeight: "400px" }}
                component="img"
                src={scan.imageUrl || ''}
                alt={scan.sname}
              />
              <CardContent>
                <Typography variant='h5' gutterBottom component="div">
                  {scan.sname}
                </Typography>
                <Typography variant='body2'>{scan.sdescription}</Typography>
                <Typography variant='body2'>Scan Type: {scan.stype}</Typography>
                <Typography variant='body2'>Scan Amount: {scan.samount}</Typography>
                {/* Add the "Book Now" button */}
                <Link to={`/book/${scan._id}/${scan.sname}/${scan.stype}/${scan.samount}`}>
                  <Button className='btn btn-primary m-2'>Book Now</Button>
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}

export default Scans;
