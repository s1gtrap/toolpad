'use client';
import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'next/navigation';
import { orderItemsDataSource, OrderItem, orderItemsCache } from '../../../../../../data/orderItems';

export default function OrdersCrudPage() {
  const params = useParams();
  const [orderItemId] = params.segments ?? [];

  return (
    <Crud<OrderItem, { orderId: string }>
      dataSource={orderItemsDataSource}
      dataSourceCache={orderItemsCache}
      rootPath={`/orders/${params.orderId}/items`}
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        list: 'Items',
        show: `Order Item ${orderItemId}`,
        create: 'New Order Item',
        edit: `Order Item ${orderItemId} - Edit`,
      }}
      params={params}
    />
  );
}
