import "server-only";

import { sanityMutationClient } from "@/lib/sanity";
import { normalizeBangladeshPhone } from "@/lib/utils/phone";

export type CreateOrUpdateCustomerInput = {
  name: string;
  phone: string;
  address: string;
  city?: string;
  email?: string;
};

export type CustomerAddress = {
  _key: string;
  label?: string;
  address: string;
  city?: string;
  isDefault: boolean;
};

export type CustomerRecord = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  addresses?: CustomerAddress[];

  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;

  firstOrderAt?: string;
  lastOrderAt?: string;

  status?: "active" | "inactive";
  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
};

export type AdminCustomer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;

  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;

  firstOrderAt?: string;
  lastOrderAt?: string;

  status: "active" | "inactive";
  tags: string[];

  defaultAddress?: {
    address: string;
    city?: string;
  };

  createdAt: string;
  updatedAt: string;
};

type CustomerStatsRecord = {
  _id: string;
  totalOrders?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
};

function normalizeCustomerEmail(email?: string): string | undefined {
  const normalized = email?.trim().toLowerCase();

  return normalized || undefined;
}

export async function findCustomerByPhone(
  phone: string,
): Promise<CustomerRecord | null> {
  const normalizedPhone = normalizeBangladeshPhone(phone);

  const query = `
    *[
      _type == "customer" &&
      phone == $phone
    ][0]{
      _id,
      name,
      phone,
      email,

      addresses[]{
        _key,
        label,
        address,
        city,
        isDefault
      },

      totalOrders,
      totalSpent,
      averageOrderValue,
      firstOrderAt,
      lastOrderAt,

      status,
      tags,

      createdAt,
      updatedAt
    }
  `;

  return sanityMutationClient.fetch<CustomerRecord | null>(query, {
    phone: normalizedPhone,
  });
}

export async function createOrUpdateCustomer(
  input: CreateOrUpdateCustomerInput,
): Promise<CustomerRecord> {
  const normalizedPhone = normalizeBangladeshPhone(input.phone);

  const existingCustomer = await findCustomerByPhone(normalizedPhone);

  const now = new Date().toISOString();

  const newAddress: CustomerAddress = {
    _key: crypto.randomUUID(),
    label: "Default",
    address: input.address.trim(),
    city: input.city?.trim() || undefined,
    isDefault: true,
  };

  const normalizedEmail = normalizeCustomerEmail(input.email);

  if (!existingCustomer) {
    return sanityMutationClient.create({
      _type: "customer",

      name: input.name.trim(),

      phone: normalizedPhone,

      email: normalizedEmail,

      addresses: [newAddress],

      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,

      status: "active",

      tags: [],

      createdAt: now,
      updatedAt: now,
    });
  }

  const existingAddresses = existingCustomer.addresses ?? [];

  const updatedAddresses = existingAddresses.map((address) => ({
    ...address,
    isDefault: false,
  }));

  updatedAddresses.push(newAddress);

  return sanityMutationClient
    .patch(existingCustomer._id)
    .set({
      name: input.name.trim(),

      email: normalizedEmail,

      addresses: updatedAddresses,

      updatedAt: now,
    })
    .commit();
}

export async function updateCustomerOrderStats({
  customerId,
  orderTotal,
  orderCreatedAt,
}: {
  customerId: string;
  orderTotal: number;
  orderCreatedAt?: string;
}): Promise<void> {
  if (!customerId) {
    throw new Error("Customer ID is required to update customer statistics.");
  }

  if (!Number.isFinite(orderTotal) || orderTotal < 0) {
    throw new Error(
      "A valid order total is required to update customer statistics.",
    );
  }

  const customer = await sanityMutationClient.fetch<CustomerStatsRecord | null>(
    `
        *[
          _type == "customer" &&
          _id == $customerId
        ][0]{
          _id,
          totalOrders,
          totalSpent,
          averageOrderValue,
          firstOrderAt,
          lastOrderAt
        }
      `,
    {
      customerId,
    },
  );

  if (!customer) {
    throw new Error("Customer not found while updating customer statistics.");
  }

  const previousTotalOrders = customer.totalOrders ?? 0;
  const previousTotalSpent = customer.totalSpent ?? 0;

  const nextTotalOrders = previousTotalOrders + 1;
  const nextTotalSpent = previousTotalSpent + orderTotal;

  const nextAverageOrderValue =
    nextTotalOrders > 0 ? nextTotalSpent / nextTotalOrders : 0;

  const timestamp = orderCreatedAt ?? new Date().toISOString();

  const patch = sanityMutationClient.patch(customer._id).set({
    totalOrders: nextTotalOrders,
    totalSpent: nextTotalSpent,
    averageOrderValue: nextAverageOrderValue,
    lastOrderAt: timestamp,
    updatedAt: new Date().toISOString(),
  });

  if (!customer.firstOrderAt) {
    patch.set({
      firstOrderAt: timestamp,
    });
  }

  await patch.commit();
}

export async function reverseCustomerOrderStats({
  customerId,
  orderTotal,
}: {
  customerId: string;
  orderTotal: number;
}): Promise<void> {
  if (!customerId) {
    throw new Error("Customer ID is required to reverse customer statistics.");
  }

  if (!Number.isFinite(orderTotal) || orderTotal < 0) {
    throw new Error(
      "A valid order total is required to reverse customer statistics.",
    );
  }

  const customer = await sanityMutationClient.fetch<CustomerStatsRecord | null>(
    `
        *[
          _type == "customer" &&
          _id == $customerId
        ][0]{
          _id,
          totalOrders,
          totalSpent,
          averageOrderValue,
          firstOrderAt,
          lastOrderAt
        }
      `,
    {
      customerId,
    },
  );

  if (!customer) {
    throw new Error("Customer not found while reversing customer statistics.");
  }

  const currentTotalOrders = customer.totalOrders ?? 0;
  const currentTotalSpent = customer.totalSpent ?? 0;

  const nextTotalOrders = Math.max(0, currentTotalOrders - 1);

  const nextTotalSpent = Math.max(0, currentTotalSpent - orderTotal);

  const nextAverageOrderValue =
    nextTotalOrders > 0 ? nextTotalSpent / nextTotalOrders : 0;

  await sanityMutationClient
    .patch(customer._id)
    .set({
      totalOrders: nextTotalOrders,
      totalSpent: nextTotalSpent,
      averageOrderValue: nextAverageOrderValue,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

/**
 * Get all customers for the admin customer list.
 */
export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  return sanityMutationClient.fetch<AdminCustomer[]>(
    `
      *[
        _type == "customer"
      ]
      | order(lastOrderAt desc, createdAt desc)
      {
        _id,
        name,
        phone,
        email,

        totalOrders,
        totalSpent,
        averageOrderValue,

        firstOrderAt,
        lastOrderAt,

        status,
        tags,

        "defaultAddress": addresses[
          isDefault == true
        ][0]{
          address,
          city
        },

        createdAt,
        updatedAt
      }
    `,
  );
}

/**
 * Get one customer for the admin customer detail page.
 */
export async function getAdminCustomerById(
  customerId: string,
): Promise<AdminCustomer | null> {
  if (!customerId) {
    return null;
  }

  return sanityMutationClient.fetch<AdminCustomer | null>(
    `
      *[
        _type == "customer" &&
        _id == $customerId
      ][0]
      {
        _id,
        name,
        phone,
        email,

        totalOrders,
        totalSpent,
        averageOrderValue,

        firstOrderAt,
        lastOrderAt,

        status,
        tags,

        "defaultAddress": addresses[
          isDefault == true
        ][0]{
          address,
          city
        },

        createdAt,
        updatedAt
      }
    `,
    {
      customerId,
    },
  );
}

export type AdminCustomerOrder = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "cancelled"
    | "completed"
    | "returned";
  shippingStatus:
    | "pending"
    | "ready"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "returned"
    | "failed";
  paymentStatus:
    "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
};

export async function getAdminCustomerOrders(
  customerId: string,
): Promise<AdminCustomerOrder[]> {
  if (!customerId) {
    return [];
  }

  return sanityMutationClient.fetch<AdminCustomerOrder[]>(
    `
      *[
        _type == "order" &&
        customer._ref == $customerId
      ]
      | order(createdAt desc)
      {
        _id,
        orderNumber,
        createdAt,
        total,
        orderStatus,
        shippingStatus,
        paymentStatus
      }
    `,
    {
      customerId,
    },
  );
}

export async function recalculateCustomerOrderStats(
  customerId: string,
): Promise<void> {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const customer = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "customer" &&
          _id == $customerId
        ][0]{
          _id
        }
      `,
    {
      customerId,
    },
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const completedOrders = await sanityMutationClient.fetch<
    {
      total: number;
      createdAt: string;
    }[]
  >(
    `
        *[
          _type == "order" &&
          customer._ref == $customerId &&
          orderStatus == "completed"
        ]
        | order(createdAt asc)
        {
          total,
          createdAt
        }
      `,
    {
      customerId,
    },
  );

  const totalOrders = completedOrders.length;

  const totalSpent = completedOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const firstOrderAt = completedOrders[0]?.createdAt;

  const lastOrderAt = completedOrders[completedOrders.length - 1]?.createdAt;

  await sanityMutationClient
    .patch(customerId)
    .set({
      totalOrders,
      totalSpent,
      averageOrderValue,
      firstOrderAt,
      lastOrderAt,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}
