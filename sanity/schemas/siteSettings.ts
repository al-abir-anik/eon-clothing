import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  fields: [
    // --------------------------------------------------
    // BRAND
    // --------------------------------------------------

    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      initialValue: "EON Clothing",
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: "description",
      title: "Brand Description",
      type: "text",
      rows: 4,
    }),

    // --------------------------------------------------
    // CONTACT
    // --------------------------------------------------

    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),

        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),

        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),

        defineField({
          name: "supportHours",
          title: "Support Hours",
          type: "string",
        }),
      ],
    }),

    // --------------------------------------------------
    // SOCIAL LINKS
    // --------------------------------------------------

    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),

        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),

        defineField({
          name: "tiktok",
          title: "TikTok",
          type: "url",
        }),

        defineField({
          name: "youtube",
          title: "YouTube",
          type: "url",
        }),

        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "url",
        }),
      ],
    }),

    // --------------------------------------------------
    // CUSTOMER POLICIES
    // --------------------------------------------------

    // defineField({
    //   name: "policies",
    //   title: "Policy Links",
    //   type: "object",
    //   fields: [
    //     defineField({
    //       name: "shipping",
    //       title: "Shipping Policy",
    //       type: "reference",
    //       to: [{ type: "page" }],
    //     }),

    //     defineField({
    //       name: "returns",
    //       title: "Returns & Exchange Policy",
    //       type: "reference",
    //       to: [{ type: "page" }],
    //     }),

    //     defineField({
    //       name: "privacy",
    //       title: "Privacy Policy",
    //       type: "reference",
    //       to: [{ type: "page" }],
    //     }),

    //     defineField({
    //       name: "terms",
    //       title: "Terms & Conditions",
    //       type: "reference",
    //       to: [{ type: "page" }],
    //     }),
    //   ],
    // }),

    // --------------------------------------------------
    // DEFAULT SEO
    // --------------------------------------------------

    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Default Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),

        defineField({
          name: "metaDescription",
          title: "Default Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),

        defineField({
          name: "ogImage",
          title: "Default Open Graph Image",
          type: "image",
          options: {
            hotspot: true,
          },
        }),
      ],
    }),

    // --------------------------------------------------
    // FOOTER
    // --------------------------------------------------

    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "description",
          title: "Footer Description",
          type: "text",
          rows: 3,
        }),

        defineField({
          name: "copyright",
          title: "Copyright Text",
          type: "string",
        }),
      ],
    }),

    // --------------------------------------------------
    // ANNOUNCEMENT
    // --------------------------------------------------

    defineField({
      name: "announcementBar",
      title: "Global Announcement Bar",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),

        defineField({
          name: "linkText",
          title: "Link Text",
          type: "string",
        }),

        defineField({
          name: "link",
          title: "Link",
          type: "string",
        }),

        defineField({
          name: "isActive",
          title: "Active",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),

    // --------------------------------------------------
    // STORE CONFIGURATION
    // --------------------------------------------------

    defineField({
      name: "store",
      title: "Store Configuration",
      type: "object",
      fields: [
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          initialValue: "BDT",
          validation: (Rule) => Rule.required().max(10),
        }),

        defineField({
          name: "currencySymbol",
          title: "Currency Symbol",
          type: "string",
          initialValue: "৳",
          validation: (Rule) => Rule.required().max(5),
        }),

        defineField({
          name: "country",
          title: "Country",
          type: "string",
          initialValue: "Bangladesh",
        }),

        defineField({
          name: "codEnabled",
          title: "Cash on Delivery Enabled",
          type: "boolean",
          initialValue: true,
        }),

        defineField({
          name: "onlinePaymentEnabled",
          title: "Online Payment Enabled",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),

    // --------------------------------------------------
    // MAINTENANCE
    // --------------------------------------------------

    defineField({
      name: "maintenanceMode",
      title: "Maintenance Mode",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "brandName",
      logo: "logo",
      maintenanceMode: "maintenanceMode",
    },

    prepare({ title, logo, maintenanceMode }) {
      return {
        title: title || "Site Settings",
        subtitle: maintenanceMode
          ? "Maintenance Mode • Active"
          : "Global Site Configuration",
        media: logo,
      };
    },
  },
});