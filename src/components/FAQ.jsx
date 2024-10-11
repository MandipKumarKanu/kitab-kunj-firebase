import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronDown,
  faBook,
  faCreditCard,
  faExchangeAlt,
  faUserCog,
  faShieldAlt,
  faHandshake,
  faShippingFast,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

const FAQ = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Questions", icon: faBook },
    { id: "general", name: "General", icon: faBook },
    { id: "account", name: "Account", icon: faUserCog },
    { id: "payments", name: "Payments", icon: faCreditCard },
    { id: "rental", name: "Rental", icon: faExchangeAlt },
    { id: "selling", name: "Selling", icon: faHandshake },
    { id: "shipping", name: "Shipping", icon: faShippingFast },
    { id: "security", name: "Security", icon: faShieldAlt },
    { id: "pricing", name: "Pricing", icon: faPercent },
  ];

  const faqItems = {
    general: [
      {
        question: "What is KitabKunj?",
        answer:
          "KitabKunj is a platform where you can buy, sell, rent, or donate books. Our mission is to make books more accessible and affordable for everyone.",
      },
      {
        question: "How do I get started?",
        answer:
          "Simply create an account, browse our collection, and start buying, renting, or listing your own books. Our user-friendly interface makes it easy to navigate and find what you're looking for.",
      },
      {
        question: "What types of books are available?",
        answer:
          "We offer a wide range of books including textbooks, fiction, non-fiction, academic books, and more. Users can list almost any type of book as long as it complies with our content guidelines.",
      },
      {
        question: "Can I donate books?",
        answer:
          "Yes! We encourage book donations. You can list your books as donations, and other users can claim them for free, paying only for shipping if applicable.",
      },
    ],
    account: [
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Sign Up' button, enter your email, create a password, and fill in your profile information. Verify your email address to start using all features.",
      },
      {
        question: "Can I have multiple accounts?",
        answer:
          "No, our policy allows only one account per user to ensure fair practices and maintain the integrity of our platform.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox to reset your password.",
      },
      {
        question: "How can I change my account information?",
        answer:
          "Go to 'Account Settings' in your profile dashboard to update your personal information, shipping address, and notification preferences.",
      },
      {
        question: "What happens to my account if I'm inactive?",
        answer:
          "Accounts remain active indefinitely, but listings may be automatically deactivated after 6 months of inactivity. You can easily reactivate them when you return.",
      },
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit points (our platform currency) which can be purchased using eSewa. Direct eSewa payments are also accepted for transactions.",
      },
      {
        question: "How do credit points work?",
        answer:
          "Credit points are our virtual currency. 1 credit point equals 1 NPR. You can use them for all transactions on the platform, making it convenient and secure.",
      },
      {
        question: "Are there any transaction fees?",
        answer:
          "We charge a small service fee for each transaction to maintain the platform. The fee is clearly displayed before you complete any purchase or rental.",
      },
      {
        question: "How do refunds work?",
        answer:
          "Refunds are processed back to your original payment method or as credit points. The refund policy varies depending on the type of transaction and the reason for the refund.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard encryption and security measures to protect your payment information. We never store complete payment details on our servers.",
      },
    ],
    rental: [
      {
        question: "How does book rental work?",
        answer:
          "You can rent books for a specified period (weekly or monthly). Select the rental option, choose your rental period, and check out. Return the book by the due date to avoid late fees.",
      },
      {
        question: "What is the maximum rental period?",
        answer:
          "The standard maximum rental period is 3 months. However, you can extend the rental if needed, subject to availability and the book owner's approval.",
      },
      {
        question: "What happens if I return a book late?",
        answer:
          "Late returns incur fees calculated daily. If you need more time, it's best to extend your rental period before the due date to avoid these charges.",
      },
      {
        question: "Can I purchase a book I've rented?",
        answer:
          "Yes, many books have a 'rent-to-own' option. If you decide to keep the book, you can often apply a portion of your rental fee toward the purchase price.",
      },
      {
        question: "What if the rented book is damaged?",
        answer:
          "Report any existing damage immediately upon receiving the book. If damage occurs during your rental period, you may be charged a fee based on the extent of the damage.",
      },
    ],
    selling: [
      {
        question: "How do I list a book for sale?",
        answer:
          "Click 'Sell a Book', fill in the details (title, author, condition, price), add photos, and publish your listing. Make sure to describe the condition accurately.",
      },
      {
        question: "How should I price my books?",
        answer:
          "Consider the book's condition, original price, and market demand. Our platform provides pricing suggestions based on similar listings.",
      },
      {
        question: "What happens after I sell a book?",
        answer:
          "Once a buyer purchases your book, you'll receive a notification. Ship the book within the specified timeframe, and the payment will be released to your account after the buyer confirms receipt.",
      },
      {
        question: "Can I edit or remove my listing?",
        answer:
          "Yes, you can edit or remove your listings at any time from your seller dashboard, as long as they haven't been purchased or rented.",
      },
    ],
    shipping: [
      {
        question: "What shipping methods are available?",
        answer:
          "We support various shipping methods including standard delivery, express shipping, and local pickup where available. Options and prices vary based on location.",
      },
      {
        question: "Who pays for shipping?",
        answer:
          "Typically, the buyer pays for shipping, but some sellers may offer free shipping. Shipping costs are always clearly displayed before purchase.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Shipping times vary by location and method chosen. Standard shipping usually takes 3-5 business days, while express shipping can be 1-2 business days.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only support domestic shipping within Nepal to ensure reliable service and reasonable shipping costs.",
      },
    ],
    security: [
      {
        question: "How do you protect user data?",
        answer:
          "We employ industry-standard encryption, secure servers, and regular security audits to protect your personal and payment information.",
      },
      {
        question: "What should I do if I suspect fraudulent activity?",
        answer:
          "Immediately report any suspicious activity through our 'Report' feature or contact customer support. We investigate all reports promptly.",
      },
      {
        question: "Are transactions insured?",
        answer:
          "Yes, all transactions are covered by our KitabKunj Guarantee, which protects both buyers and sellers from fraud and ensures satisfaction.",
      },
    ],
    pricing: [
      {
        question: "How are rental prices determined?",
        answer:
          "Rental prices are set by book owners based on the book's value, condition, and demand. We provide pricing guidelines to ensure fair rates.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees. All applicable fees, including service charges and shipping costs, are clearly displayed before you complete any transaction.",
      },
      {
        question: "Do you offer any discounts?",
        answer:
          "Yes, we regularly run promotions and offer discounts. Students can get special rates, and first-time users often receive welcome discounts.",
      },
    ],
  };

  const toggleFAQ = (categoryId, index) => {
    const itemKey = `${categoryId}-${index}`;
    setActiveItem(activeItem === itemKey ? null : itemKey);
  };

  const filteredFAQs = useMemo(() => {
    if (activeCategory === "all") {
      return Object.entries(faqItems).flatMap(([category, items]) =>
        items
          .filter((item) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => ({ ...item, category }))
      );
    }

    return (
      faqItems[activeCategory]
        ?.filter((item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item) => ({ ...item, category: activeCategory })) || []
    );
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about KitabKunj
          </p>
        </div>

        <div className="relative mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 pr-4 text-gray-900 border-2 border-purple-100 rounded-full focus:outline-none focus:border-purple-500 transition-colors"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all ${
                activeCategory === category.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-purple-100"
              }`}
            >
              <FontAwesomeIcon icon={category.icon} className="mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeCategory === "all" ? (
            Object.entries(faqItems).map(([category, items]) => {
              const categoryInfo = categories.find((c) => c.id === category);
              const filteredItems = items.filter((item) =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon
                      icon={categoryInfo?.icon || faBook}
                      className="mr-3 text-purple-500"
                    />
                    {categoryInfo?.name || category}
                  </h2>
                  <div className="space-y-4">
                    {filteredItems.map((item, index) => (
                      <FAQItem
                        key={index}
                        item={item}
                        isActive={activeItem === `${category}-${index}`}
                        onClick={() => toggleFAQ(category, index)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  isActive={activeItem === `${activeCategory}-${index}`}
                  onClick={() => toggleFAQ(activeCategory, index)}
                />
              ))}
            </div>
          )}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              No results found. Please try a different search term or category.
            </p>
          </div>
        )}

        <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is always here to help you with any questions or
            concerns.
          </p>
          <a
            href="/contact"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ item, isActive, onClick }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
    <button
      onClick={onClick}
      className="w-full text-left p-6 focus:outline-none"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 pr-8">
          {item.question}
        </h3>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-purple-500 transition-transform duration-300 ${
            isActive ? "transform rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`mt-4 text-gray-600 transition-all duration-300 ${
          isActive ? "block" : "hidden"
        }`}
      >
        {item.answer}
      </div>
    </button>
  </div>
);

export default FAQ;
