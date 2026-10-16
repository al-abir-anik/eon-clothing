import { categoryType } from "./category";
import { comboType } from "./combo";
import { customerType } from "./customer";
import { discountType } from "./discount";
import { expenseType } from "./expense";
import { orderType } from "./order";
import { productType } from "./product";
import { productProfileType } from "./productProfile";
import { reviewType } from "./review";
import { siteSettingsType } from "./siteSettings";

export const schema = {
  types: [
    productType,
    comboType,
    orderType,
    productProfileType,
    categoryType,
    customerType,
    reviewType,
    discountType,
    expenseType,
    siteSettingsType,
  ],
};
