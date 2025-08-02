"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out AURA+",
      price: { monthly: 0, annual: 0 },
      features: [
        "50 messages per month",
        "Basic AI responses",
        "Text chat only",
        "Community support",
        "Standard response time",
      ],
      limitations: ["No voice features", "No image uploads", "Limited chat history", "No priority support"],
      popular: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      description: "Best for individuals and small teams",
      price: { monthly: 19, annual: 15 },
      features: [
        "Unlimited messages",
        "Advanced AI responses",
        "Voice chat & synthesis",
        "Image upload & analysis",
        "Full chat history",
        "Priority support",
        "Custom voice settings",
        "Export conversations",
      ],
      limitations: [],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: { monthly: 99, annual: 79 },
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "User management",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Custom branding",
        "Advanced analytics",
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${!isAnnual ? "text-white font-semibold" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? "text-white font-semibold" : "text-gray-400"}`}>Annual</span>
            {isAnnual && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Save 20%</span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-blue-600 to-blue-700 ring-2 ring-blue-400 scale-105"
                  : "bg-white/10 backdrop-blur-sm border border-white/20"
              } transition-all duration-300 hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-300 ml-2">{plan.price.monthly > 0 ? "/month" : ""}</span>
                  {isAnnual && plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-400 mt-1">Billed annually (${plan.price.annual * 12}/year)</div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-center opacity-60">
                    <X className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400 line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular ? "bg-white text-blue-600 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700"
                } transform hover:scale-105`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h4>
              <p className="text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h4>
              <p className="text-gray-300">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h4>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-3">Do you offer refunds?</h4>
              <p className="text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
