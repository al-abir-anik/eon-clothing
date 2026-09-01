import { type SchemaTypeDefinition } from "sanity";
import { productType } from "./productSchema";
import { categoryType } from "./categorySchema";
import { productTypeType } from "./productTypeSchema";
import { baseGarmentType } from "./baseGarmentSchema";
import { orderType } from "./orderSchema";
import { colorType } from "./colorSchema";
import { sizeType } from "./sizeSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productType,
    categoryType,
    productTypeType,
    baseGarmentType,
    colorType,
    sizeType,
    orderType,
  ],
};
