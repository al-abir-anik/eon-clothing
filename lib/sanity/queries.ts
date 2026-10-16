export const categoryQueries = {
  activeCategories: `
    *[
      _type == "category" &&
      isActive == true
    ]
    | order(order asc, title asc) {
      _id,
      title,
      slug,
      description,
      image,
      order,
      isActive,
      "parentCategory": parentCategory->{
        _id,
        title,
        slug
      },
      seo
    }
  `,

  categoryBySlug: `
    *[
      _type == "category" &&
      slug.current == $slug &&
      isActive == true
    ][0] {
      _id,
      title,
      slug,
      description,
      image,
      order,
      isActive,
      "parentCategory": parentCategory->{
        _id,
        title,
        slug
      },
      seo
    }
  `,
};

export const productProfileQueries = {
  activeProfiles: `
    *[
      _type == "productProfile" &&
      isActive == true
    ]
    | order(title asc) {
      _id,
      title,
      slug,
      description,
      careInstructions,
      sizeChart,
      features,
      specifications,
      defaultPrice,
      defaultCompareAtPrice,
      defaultCostPrice,
      shippingNote,
      seo,
      isActive,
      "category": category->{
        _id,
        title,
        slug,
        "parentCategory": parentCategory->{
          _id,
          title,
          slug
        }
      }
    }
  `,

  profileBySlug: `
    *[
      _type == "productProfile" &&
      slug.current == $slug &&
      isActive == true
    ][0] {
      _id,
      title,
      slug,
      description,
      careInstructions,
      sizeChart,
      features,
      specifications,
      defaultPrice,
      defaultCompareAtPrice,
      shippingNote,
      seo,
      isActive,
      "category": category->{
        _id,
        title,
        slug,
        "parentCategory": parentCategory->{
          _id,
          title,
          slug
        }
      }
    }
  `,
};

export const productQueries = {
  activeProducts: `
    *[
      _type == "product" &&
      status == "active"
    ]
    | order(_createdAt desc) {
      _id,
      name,
      slug,
      sku,

      "profile": profile->{
      _id,
      title,
      slug,
      description,
    
      careInstructions,
      features,
      specifications,
    
      sizeChart,
    
      defaultPrice,
      defaultCompareAtPrice,
      defaultCostPrice,

      seo,

     "category": category->{
      _id,
      title,
      slug,
  
      "parentCategory": parentCategory->{
        _id,
        title,
        slug
      }
    }
  },

      color,
      colorHex,
      images,

      price,
      compareAtPrice,

      inventory {
        stockBySize,
        incomingQuantity
      },

      status,
      tags,
      seo
    }
  `,

  productBySlug: `
    *[
      _type == "product" &&
      slug.current == $slug &&
      status == "active"
    ][0] {
      _id,
      name,
      slug,
      sku,

      "profile": profile->{
      _id,
      title,
      slug,
      description,
    
      careInstructions,
      features,
      specifications,
    
      sizeChart,
    
      defaultPrice,
      defaultCompareAtPrice,
      defaultCostPrice,
    
      seo,
    
      "category": category->{
        _id,
        title,
        slug,
    
        "parentCategory": parentCategory->{
          _id,
          title,
          slug
        }
      }
    },

      color,
      colorHex,
      images,

      price,
      compareAtPrice,

      inventory {
        stockBySize,
        incomingQuantity
      },

      status,
      tags,
      seo
    }
  `,

  productBySku: `
    *[
      _type == "product" &&
      sku == $sku
    ][0] {
      _id,
      name,
      slug,
      sku,
      "profile": profile->{
        _id,
        title,
        slug
      },
      color,
      colorHex,
      images,
      price,
      compareAtPrice,
      inventory {
        stockBySize,
        incomingQuantity
      },
      status,
      tags,
      seo
    }
  `,

  productsByProfile: `
    *[
      _type == "product" &&
      profile._ref == $profileId &&
      status == "active"
    ]
    | order(name asc) {
      _id,
      name,
      slug,
      sku,
      "profile": profile->{
        _id,
        title,
        slug
      },
      color,
      colorHex,
      images,
      price,
      compareAtPrice,
      inventory {
        stockBySize,
        incomingQuantity
      },
      status,
      tags,
      seo
    }
  `,

  productsByCategory: `
    *[
      _type == "product" &&
      status == "active" &&
      profile->category._ref == $categoryId
    ]
    | order(_createdAt desc) {
      _id,
      name,
      slug,
      sku,
      "profile": profile->{
        _id,
        title,
        slug,
        "category": category->{
          _id,
          title,
          slug
        }
      },
      color,
      colorHex,
      images,
      price,
      compareAtPrice,
      inventory {
        stockBySize,
        incomingQuantity
      },
      status,
      tags,
      seo
    }
  `,
};

export const comboQueries = {
  activeCombos: `
    *[
      _type == "combo" &&
      isActive == true
    ]
    | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      images,

      "products": products[]->{
        _id,
        name,
        slug,
        sku,
        color,
        colorHex,
        price,
        images
      },

      "profiles": profiles[]->{
        _id,
        title,
        "slug": slug.current
      },

      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current
      },

      itemCount,
      allowDuplicateProducts,
      requireSizeSelection,

      regularPrice,
      offerPrice,

      startDate,
      endDate,
      isActive,
      seo
    }
  `,

  comboBySlug: `
    *[
      _type == "combo" &&
      slug.current == $slug &&
      isActive == true
    ][0] {
      _id,
      name,
      slug,
      description,
      images,

      "products": products[]->{
        _id,
        name,
        slug,
        sku,
        color,
        colorHex,
        price,
        images,
        inventory {
          stockBySize
        }
      },

      "profiles": profiles[]->{
        _id,
        title,
        "slug": slug.current
      },

      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current
      },

      itemCount,
      allowDuplicateProducts,
      requireSizeSelection,

      regularPrice,
      offerPrice,

      startDate,
      endDate,
      isActive,
      seo
    }
  `,
};

export const reviewQueries = {
  productReviews: `
    *[
      _type == "review" &&
      isApproved == true &&
      product._ref == $productId
    ]
    | order(createdAt desc) {
      _id,
      customerName,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase,
      isApproved,
      createdAt
    }
  `,
};

export const productComboQueries = {
  activeForProduct: `
    *[
      _type == "combo" &&
      isActive == true &&
      profile._ref == $profileId
    ]
    | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      images,

      "profile": profile->{
        _id,
        title,
        "slug": slug.current
      },

      itemCount,
      allowDuplicateProducts,
      requireSizeSelection,

      regularPrice,
      offerPrice,

      isActive,
      seo
    }
  `,
};

export const orderQueries = {
  productsByIds: `
    *[
      _type == "product" &&
      _id in $productIds &&
      status == "active"
    ]{
      _id,
      name,
      slug,
      sku,
      color,
      colorHex,
      images,

      price,
      compareAtPrice,
      costPrice,

     profile->{
      _id,
      title,
      slug,
      category->{
        _id,
        title,
        slug
      },
      defaultPrice,
      defaultCompareAtPrice,
      defaultCostPrice
    },

      inventory{
        stockBySize[]{
          size,
          quantity,
          reservedQuantity,
          lowStockThreshold
        },
        incomingQuantity
      },

      status
    }
  `,

  combosByIds: `
  *[
    _type == "combo" &&
    _id in $comboIds &&
    isActive == true
  ]{
    _id,
    name,

    itemCount,
    allowDuplicateProducts,
    requireSizeSelection,

    regularPrice,
    offerPrice,

    isActive,

    "profile": profile->{
      _id,
      title,
      slug
    },

    "products": *[
      _type == "product" &&
      profile._ref == ^.profile._ref &&
      status == "active"
    ] | order(name asc) {
      _id,
      name,
      slug,
      sku,
      color,
      colorHex,

      price,
      compareAtPrice,
      costPrice,

      "profile": profile->{
        _id,
        title,
        slug,

        "category": category->{
          _id,
          title,
          slug
        },

        defaultPrice,
        defaultCompareAtPrice,
        defaultCostPrice
      },

      inventory{
        stockBySize[]{
          size,
          quantity,
          reservedQuantity,
          lowStockThreshold
        },
        incomingQuantity
      },

      status
    }
  }
`,
};

export const siteSettingsQueries = {
  siteSettings: `
    *[
      _type == "siteSettings"
    ][0] {
      ...
    }
  `,
};

export const searchQueries = {
  products: `
    *[
      _type == "product" &&
      status == "active" &&
      (
        name match $search ||
        sku match $search ||
        color match $search ||
        $search in tags ||
        profile->title match $search ||
        profile->category->title match $search
      )
    ]
    | order(_createdAt desc) {
      _id,
      name,
      slug,
      sku,
      "profile": profile->{
        _id,
        title,
        slug,
        "category": category->{
          _id,
          title,
          slug
        }
      },
      color,
      colorHex,
      images,
      price,
      compareAtPrice,
      inventory {
        stockBySize,
        incomingQuantity
      },
      status,
      tags,
      seo
    }
  `,
};

export const discountQueries = {
  allDiscounts: `
    *[
      _type == "discount"
    ]
    | order(_createdAt desc) {
      _id,
      name,

      discountMode,
      code,
      description,

      discountType,
      value,

      minimumOrderAmount,
      maximumDiscountAmount,

      appliesTo,

      "products": products[]->{
        _id
      },

      "categories": categories[]->{
        _id
      },

      "profiles": profiles[]->{
        _id
      },

      "combos": combos[]->{
        _id
      },

      startDate,
      endDate,

      usageLimit,
      usageCount,
      perCustomerLimit,

      stackable,
      isActive
    }
  `,

  activeDiscounts: `
    *[
      _type == "discount" &&
      isActive == true &&
      (
        !defined(startDate) ||
        startDate <= now()
      ) &&
      (
        !defined(endDate) ||
        endDate >= now()
      ) &&
      (
        !defined(usageLimit) ||
        usageCount < usageLimit
      )
    ]
    | order(_createdAt asc) {
      _id,
      name,

      discountMode,
      code,
      description,

      discountType,
      value,

      minimumOrderAmount,
      maximumDiscountAmount,

      appliesTo,

      "products": products[]->{
        _id
      },

      "categories": categories[]->{
        _id
      },

      "profiles": profiles[]->{
        _id
      },

      "combos": combos[]->{
        _id
      },

      startDate,
      endDate,

      usageLimit,
      usageCount,
      perCustomerLimit,

      stackable,
      isActive
    }
  `,

  discountByCode: `
    *[
      _type == "discount" &&
      isActive == true &&
      discountMode == "coupon" &&
      code == $code &&
      (
        !defined(startDate) ||
        startDate <= now()
      ) &&
      (
        !defined(endDate) ||
        endDate >= now()
      ) &&
      (
        !defined(usageLimit) ||
        usageCount < usageLimit
      )
    ][0] {
      _id,
      name,

      discountMode,
      code,
      description,

      discountType,
      value,

      minimumOrderAmount,
      maximumDiscountAmount,

      appliesTo,

      "products": products[]->{
        _id
      },

      "categories": categories[]->{
        _id
      },

      "profiles": profiles[]->{
        _id
      },

      "combos": combos[]->{
        _id
      },

      startDate,
      endDate,

      usageLimit,
      usageCount,
      perCustomerLimit,

      stackable,
      isActive
    }
  `,

  customerDiscountUsage: `
    count(
      *[
        _type == "order" &&
        customer._ref == $customerId &&
        defined(appliedDiscounts[].discountId) &&
        $discountId in appliedDiscounts[].discountId &&
        orderStatus != "cancelled"
      ]
    )
  `,
};
