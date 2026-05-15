import React from 'react';
import PolicyLayout from '../../components/PolicyLayout';

export const metadata = {
  title: 'Shipping Policy | Pubesto',
  description: 'Learn about Pubesto delivery timelines and shipping practices.',
};

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>Most in-stock products dispatch within 1-2 business days and arrive within 2-4 business days after dispatch.</p>
      <p>Delivery timelines can vary by product, address, courier availability, and public holidays.</p>
      <p>We work with trusted logistics partners to ensure your products reach you safely and as quickly as possible. Once your order is dispatched, you will receive a notification with tracking details.</p>
    </PolicyLayout>
  );
}
