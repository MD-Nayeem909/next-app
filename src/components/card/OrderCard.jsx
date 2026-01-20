import React from "react";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const OrderCard = ({ order }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={order._id}
      className="bg-base-100/50 rounded-4xl p-5 border border-base-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <figure className="h-48 overflow-hidden">
        <img
          src={order.productId?.image || "/placeholder.jpg"}
          alt={order.productId?.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl"
        />
      </figure>
      <div className="card-body p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="card-title font-black text-lg">
            {order.productId?.title}
          </h3>
          <div className="badge badge-success badge-outline font-bold text-xs">
            {order.status}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral">
            <Calendar size={14} />
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            <Tag size={16} /> ${order.price}
          </div>
        </div>

        <div className="card-actions justify-end">
          <Link href={`/products/${order.productId?._id}`}>
            <button className="btn btn-primary btn-sm rounded-xl font-bold">
              Details <ExternalLink size={14} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
