import React from 'react';

const Quantity = () => {
    return (
        <div>
             {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex justify-between">
            <span className="text-sm">Quantity</span>
            <QuantityButton product={product} selectedSize={selectedSize} />
          </div>
          <div className="pt-1 flex items-center justify-between border-t">
            <span className="text-sm font-semibold">Subtotal</span>
            <span>{product?.price && product?.price * itemCount}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddtocart}
          className="w-full h-11 font-semibold text-white bg-darkColor/85 hover:bg-darkColor tracking-wide rounded-xs transition-colors"
        >
          Add to Cart
        </button>
      )}
        </div>
    );
};

export default Quantity;