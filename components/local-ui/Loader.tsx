"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed min-h-screen w-full bg-white left-0 top-0 flex items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-1">
        <motion.div className="flex items-center space-x-2 text-darkColor">
          <Loader2 className="animate-spin" />
          <span className="font-semibold tracking-wide">
            GrayHanger is loading...
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
