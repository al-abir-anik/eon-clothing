"use server";

import { recalculateCustomerOrderStats } from "@/lib/ecommerce/customers/customer-service";
import { sanityMutationClient } from "@/lib/sanity";

export async function updateCustomerStatus({
  customerId,
  status,
}: {
  customerId: string;
  status: "active" | "inactive";
}) {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  await sanityMutationClient
    .patch(customerId)
    .set({
      status,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function updateCustomer({
  customerId,
  name,
  phone,
  email,
  address,
  city,
}: {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
}) {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  if (!name.trim()) {
    throw new Error("Customer name is required.");
  }

  if (!phone.trim()) {
    throw new Error("Customer phone is required.");
  }

  const customer = await sanityMutationClient.fetch<{
    addresses?: {
      _key: string;
      label?: string;
      address: string;
      city?: string;
      isDefault: boolean;
    }[];
  } | null>(
    `
      *[
        _type == "customer" &&
        _id == $customerId
      ][0]{
        addresses[]{
          _key,
          label,
          address,
          city,
          isDefault
        }
      }
    `,
    { customerId },
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const existingAddresses = customer.addresses ?? [];

  const updatedAddresses = existingAddresses.map((customerAddress) => ({
    ...customerAddress,
    ...(customerAddress.isDefault
      ? {
          address: address?.trim() || customerAddress.address,
          city: city?.trim() || undefined,
        }
      : {}),
  }));

  await sanityMutationClient
    .patch(customerId)
    .set({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim().toLowerCase() || undefined,
      addresses: updatedAddresses,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function updateCustomerTags({
  customerId,
  tags,
}: {
  customerId: string;
  tags: string[];
}) {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const normalizedTags = [
    ...new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
  ];

  await sanityMutationClient
    .patch(customerId)
    .set({
      tags: normalizedTags,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function recalculateCustomerStats(
  customerId: string,
) {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  await recalculateCustomerOrderStats(customerId);
}
