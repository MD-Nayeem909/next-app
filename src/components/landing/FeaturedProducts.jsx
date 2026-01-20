import React, { useEffect, useState } from "react";
import ProductCard from "../card/ProductCard";
import Link from "next/link";
import ProductSkeleton from "../ui/ProductSkeleton";
import Loading from "@/app/loading";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <section id="products" className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl sm:text-5xl lg:text-4xl font-bold text-base-content tracking-tight leading-tight">
            Explore Our <span className="text-primary italic">Featured</span>{" "}
            Products
          </h2>
          <p className="text-neutral font-medium text-lg">
            Discover unique items crafted and shared by our professional
            community.
          </p>
        </div>
        <Link href="products">
          <button className="btn btn-primary btn-outline rounded-2xl px-8 font-bold">
            View All Products
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading
          ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
          : products
              .slice(0, 6)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
      </div>
      {!loading && products.length === 0 && (
        <div className="col-span-full py-20 text-center bg-base-100/50 rounded-[3rem] border-2 border-base-100">
          <p className="text-neutral font-bold">
            No products available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
