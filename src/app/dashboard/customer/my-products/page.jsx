"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const CustomerProducts = () => {
  const { data: session } = useSession();
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      //const res = await fetch(`/api/orders/user/${session.user.id}`);
      setTimeout(() => {
        setPurchasedItems([
          {
            _id: "1",
            title: "Premium Logistics Suite",
            price: 120,
            date: "2024-03-10",
            image:
              "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=200",
            status: "Delivered",
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchPurchases();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading your items...</div>
    );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
          <ShoppingBag className="text-primary" /> My Purchases
        </h1>
        <p className="text-neutral font-medium">
          View and manage the products you've bought.
        </p>
      </div>

      {purchasedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedItems.map((item) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item._id}
              className="bg-base-100/50 rounded-4xl p-5 border border-base-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-base-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-base-content leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-neutral">
                      <Calendar size={12} />
                      <span className="text-[11px] font-bold uppercase">
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-base-content">
                    ${item.price}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral/50 flex items-center justify-between">
                <span className="px-3 py-1 bg-success/20 text-success rounded-full text-[10px] font-black uppercase tracking-widest">
                  {item.status}
                </span>
                <Link
                  href={`/products/${item._id}`}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all"
                >
                  View Product <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100/50 rounded-[3rem] border-2 border-dashed border-base-100">
          <div className="w-20 h-20 bg-base-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingBag className="text-neutral" size={40} />
          </div>
          <h3 className="text-xl font-bold text-base-content">No purchases yet</h3>
          <p className="text-neutral mb-6">
            Explore our gallery and find amazing products!
          </p>
          <Link href="/products" className="btn btn-primary rounded-xl px-8">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
