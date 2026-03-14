"use client";

import { Product } from "@/sanity.types";
import { useState } from "react";
import SizeStock from "../local-ui/SizeStock";
import AddToCartButton from "../cart/AddToCart";

export type SizeItem = {
  size?: string;
  stock?: "in_stock" | "out_of_stock";
  _key: string;
};
interface Props {
  product?: Product;
}

const ProductAction = ({ product }: Props) => {

  return (
    <div className="w-full flex flex-col">
     

     
    </div>
  );
};

export default ProductAction;
