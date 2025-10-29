import React from 'react';
import { PaymentPanel } from '../../features/payments/basic';

const PaymentsPage: React.FC = () => {
  return (
    <div className="p-6">
      <PaymentPanel />
    </div>
  );
};

export default PaymentsPage;