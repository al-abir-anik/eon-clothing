interface Props {
  price: number | undefined;
  regularPrice: number | undefined;
  className?: string;
}

const PriceView = ({ price, regularPrice, className }: Props) => {
  return (
    <div className="flex items-baseline gap-3 font-semibold">
      <p className={className}>
        TK. <span>{price}</span>
      </p>
      {regularPrice && (
        <p className="line-through text-gray-500">
          TK. <span className="">{regularPrice}</span>
        </p>
      )}
    </div>
  );
};

export default PriceView;
