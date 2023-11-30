import React from 'react';
import DealersChart from './dealersChart';
import TestDriveChart from './testDriveChart';
import OrderChart from './OrderChart';





const Dashboard = () => {
    return (
        <div>
           <DealersChart/>
           <TestDriveChart/>
            <OrderChart/>
        </div>
    );
};

export default Dashboard;