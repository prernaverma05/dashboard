import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
// import Customers from './pages/Customers';
import Teams from './pages/Teams';
import Industries from './pages/Industries';
import ACVRangePage from './pages/ACVRange';
import CustomerTypePage from './pages/CustomerType';

const App: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/customers" element={<Customers />} /> */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/acv-range" element={<ACVRangePage />} />
            <Route path="/customer-type" element={<CustomerTypePage />} />
          </Routes>
        </Container>
      </Box>
    </Layout>
  );
};

export default App; 