"use client";

import { SizeItem } from "../product/ProductAction";

// type SizeItem = {
//   size?: string;
//   stock?: "in_stock" | "out_of_stock";
//   _key: string;
// };
// type Props = {
//   sizeStock?: SizeItem[];
// };
type Props = {
  sizeStock?: SizeItem[];
  selectedSize: SizeItem | null;
  setSelectedSize: (size: SizeItem) => void;
};

const SizeStock = ({
  sizeStock = [],
  selectedSize,
  setSelectedSize,
}: Props) => {
  return (
   <></>
  );
};

export default SizeStock;
