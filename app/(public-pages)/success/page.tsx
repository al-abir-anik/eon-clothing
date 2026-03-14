"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/local-ui/Loader";
import useCartStore from "@/store/cartStore";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetCart } = useCartStore();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [orderExists, setOrderExists] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }

    const verifyOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);
        if (!res.ok) {
          router.replace("/");
          return;
        }
        setOrderExists(true);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    
    verifyOrder();
    resetCart();
  }, [orderId, router, resetCart]);

  if (loading) {
    return <Loader />;
  }

  if (!orderExists) return null;

  return (
    <div className="pt-10 pb-20 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-8 py-12 max-w-lg bg-white rounded-xs shadow text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <Check className="text-white w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>

        <p className="space-y-4 mb-8 text-center text-gray-700">
          Thank you for your purchase. <br /> We&apos;re processing your order
          and will ship it soon.
        </p>

        <div className="p-4 mb-8 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="mb-2 text-gray-700">
            Order Number:{" "}
            <span className="text-black font-semibold">{orderId}</span>
          </p>

          <ul className="text-gray-700 text-sm space-y-1.5 font-medium">
            <li>Track your order status anytime.</li>
          </ul>
        </div>

        {/* <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Recent Orders</h3>
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order?._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {order?._id}
                </span>
                <span className="text-sm font-medium px-2 py-1 bg-gray-200 rounded-full">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/"
            className="py-3 font-semibold rounded-xs border hover:border-darkColor transition-colors"
          >
            Home
          </Link>

          <Link
            href="/"
            className="text-white py-3 font-semibold rounded-xs bg-darkColor/80 hover:bg-darkColor  transition-colors"
          >
            Track Order
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
