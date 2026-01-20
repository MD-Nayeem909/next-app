"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight, Tag } from "lucide-react";
import Link from "next/link";

const ProductCard = ({ product, key }) => {
  return (
    <motion.div
      key={product?._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: key * 0.1 }}
      className="group relative bg-base-100/50 rounded-[2.5rem] p-4 border border-transparent hover:border-base-200 hover:bg-base-100 transition-all duration-500 hover:shadow-2xl hover:shadow-base-200/50"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-base-100 mb-6">
        <img
          src={product?.image || "/placeholder.png"}
          alt={product?.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="badge bg-primary backdrop-blur-md border-none text-white font-bold px-4 py-3 rounded-full shadow-sm flex gap-2">
            <Tag size={14} className="text-white" /> {product?.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-base-content line-clamp-1">
            {product?.title}
          </h3>
          <span className="text-xl font-black text-primary">
            ${product?.price}
          </span>
        </div>
        <p className="text-neutral text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
          {product?.description}
        </p>
        <Link href={`/products/${product._id}`}>
          <button className="w-full py-4 bg-base-100 text-base-content rounded-3xl font-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors group/btn shadow-xl shadow-slate-900/10">
            <ShoppingBag size={18} />
            View Details
            <ArrowUpRight
              size={18}
              className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
            />
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
