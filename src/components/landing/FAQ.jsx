const FAQ = () => {
  const faqs = [
    {
      q: "How do I get my product after purchase?",
      a: "Once your payment is successful, the product will automatically appear in your 'My Purchases' dashboard.",
    },
    {
      q: "Is the payment secure?",
      a: "Yes, we use Stripe, a world-class secure payment gateway. We never store your card information.",
    },
    {
      q: "Can I get a refund?",
      a: "Since these are digital products, we generally don't offer refunds. Please contact support for any issues.",
    },
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Frequently Asked Questions</h2>
        <p className="text-neutral">
          Everything you need to know about our service.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="collapse collapse-plus bg-base-100/50 rounded-4xl border border-base-300"
          >
            <input
              type="radio"
              name="my-accordion-3"
              defaultChecked={index === 0}
            />
            <div className="collapse-title text-xl font-bold px-8 py-5">
              {faq.q}
            </div>
            <div className="collapse-content px-8 pb-5 text-neutral">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default FAQ;
