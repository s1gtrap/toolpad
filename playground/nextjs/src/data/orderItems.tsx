'use client';

import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';


export interface OrderItem extends DataModel {
  id: number;
  orderId: number;
  projectId: number;
  quantity: number;
}

const getOrderItemsStore = (): OrderItem[] => {
  const value = localStorage.getItem('order-items-store');
  return value ? JSON.parse(value) : [];
};

const setOrderItemsStore = (value: OrderItem[]) => {
  return localStorage.setItem('order-items-store', JSON.stringify(value));
};

export const orderItemsDataSource: DataSource<OrderItem, { orderId: string, itemId: string }> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'orderId', headerName: 'Order ID', type: 'number' },
    { field: 'productId', headerName: 'Product ID', type: 'number' },
    { field: 'quantity', headerName: 'Quantity', type: 'number' },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel, params }) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const ordersStore = getOrderItemsStore();

    let filteredOrderItems = ordersStore.filter((orderItem) => {
      return String(orderItem.orderId) === params.orderId;
    });

    // Apply filters (example only)
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        filteredOrderItems = filteredOrderItems.filter((orderItem) => {
          const orderItemValue = orderItem[field];

          switch (operator) {
            case 'contains':
              return String(orderItemValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return orderItemValue === value;
            case 'startsWith':
              return String(orderItemValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(orderItemValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (orderItemValue as number) > value;
            case '<':
              return (orderItemValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      filteredOrderItems.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) {
            return sort === 'asc' ? -1 : 1;
          }
          if ((a[field] as number) > (b[field] as number)) {
            return sort === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedOrders = filteredOrderItems.slice(start, end);

    return {
      items: paginatedOrders,
      itemCount: filteredOrderItems.length,
    };
  },
  getOne: async (orderId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const ordersStore = getOrderItemsStore();

    const orderToShow = ordersStore.find((order) => order.id === Number(orderId));

    if (!orderToShow) {
      throw new Error('Order item not found');
    }
    return orderToShow;
  },
  createOne: async (data) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const orderItemsStore = getOrderItemsStore();

    const newOrderItem = {
      id: orderItemsStore.reduce((max, orderItem) => Math.max(max, orderItem.id), 0) + 1,
      ...data,
    } as OrderItem;

    setOrderItemsStore([...orderItemsStore, newOrderItem]);

    return newOrderItem;
  },
  updateOne: async (orderId, data) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const ordersStore = getOrderItemsStore();

    let updatedOrderItem: OrderItem | null = null;

    setOrderItemsStore(
      ordersStore.map((order) => {
        if (order.id === Number(orderId)) {
          updatedOrderItem = { ...order, ...data };
          return updatedOrderItem;
        }
        return order;
      }),
    );

    if (!updatedOrderItem) {
      throw new Error('Order item not found');
    }
    return updatedOrderItem;
  },
  deleteOne: async (orderId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const ordersStore = getOrderItemsStore();

    setOrderItemsStore(ordersStore.filter((order) => order.id !== Number(orderId)));
  },
  validate: z.object({
    orderId: z.number().min(1),
    productId: z.number().min(1),
    quantity: z.number().min(1),
  })['~standard'].validate,
};

export const orderItemsCache = new DataSourceCache();
