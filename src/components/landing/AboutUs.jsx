const AboutUs = () => {
  return (
    <section
      id="about"
      className="py-4 md:py-20 bg-base-100/50 rounded-[3.5rem] my-10 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 md:px-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Empowering Your{" "}
            <span className="text-primary">Digital Journey</span>
          </h2>
          <p className="text-lg text-neutral mb-8 leading-relaxed">
            Welcome to Fast-Parcel! We provide high-quality digital assets and
            tools to help you build your dreams faster. Our mission is to make
            premium resources accessible to everyone.
          </p>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm text-center flex-1">
              <h4 className="text-3xl font-black text-primary">10k+</h4>
              <p className="text-xs font-bold text-neutral uppercase">
                Customers
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm text-center flex-1">
              <h4 className="text-3xl font-black text-secondary">500+</h4>
              <p className="text-xs font-bold text-neutral uppercase">
                Products
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-100 bg-primary rounded-[3rem] rotate-3 absolute top-0 left-0 -z-10 opacity-20"></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800"
            alt="Our Team"
            className="rounded-[3rem] shadow-2xl object-cover h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
