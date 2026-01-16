import AccordionItem from "../components/AccordionItem";
import Link from "next/link";
import React from "react";

const FaqContent = [
  {
    question: "What features can I access with a free account?",
    answer: [
      <p key="p1">
        With a free account, you can try out core features with the following
        usage limits:
      </p>,
      <ul key="ul1" className="list-disc pl-5">
        <li>
          <b>Search Company:</b> Up to 5 searches. View company profiles, key
          team members, pipelines, financials, patents, and more.
        </li>
        <li>
          <b>Search Asset:</b> Up to 5 searches. Discover promising drugs in
          clinical trials along with key development indicators.
        </li>
        <li>
          <b>Use Insights AI to generate reports:</b> Up to 5 queries. Report
          download is not available on the free plan.
        </li>
      </ul>,
      <br key="br1" />,
      <p key="p2">
        These features help you identify potential partners, explore high-value
        companies and assets, expand your network, and evaluate strategic
        collaboration or investment opportunities.
      </p>,
    ],
  },
  {
    question: "What are the benefits of upgrading to Pro?",
    answer: [
      <p key="p1">Upgrading to the Pro plan unlocks full access to:</p>,
      <ul key="ul1" className="list-disc pl-5">
        <li>Unlimited company and drug asset searches</li>
        <li>
          Unlimited use of Insights AI for analysis, with full report downloads
        </li>
        <li>Company and product comparison tools</li>
        <li>Access to historical data and advanced filtering options</li>
        <li>
          14-day free trial with no charge if canceled during the trial period
        </li>
      </ul>,
    ],
  },
  {
    question:
      "Does the BIODND Pro plan require a long-term commitment? Can I cancel anytime?",
    answer: [
      <p key="p1">
        No long-term commitment is required. Pro is available via monthly or
        annual subscription and can be canceled anytime. After cancellation, no
        charges will be made for the next billing cycle.
      </p>,
    ],
  },
  {
    question: "Will I be charged automatically after the Pro trial ends?",
    answer: [
      <p key="p1">
        Yes, once your 14-day free trial ends, your subscription will
        automatically convert to a paid plan and be charged. You will not be
        charged if you cancel during the trial period.
      </p>,
    ],
  },
  {
    question: "Who should consider the Enterprise plan?",
    answer: [
      <p key="p1">
        The Enterprise plan is ideal for organizations with the following needs:
      </p>,
      <ul key="ul1" className="list-disc pl-5">
        <li>Multi-user team access</li>
        <li>API integration for data connectivity</li>
        <li>Dedicated consulting support and custom reporting</li>
      </ul>,
      <br key="br1" />,
      <p key="p2">
        Contact our team for more information:{" "}
        <a
          href="https://biodnd.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-color underline"
        >
          https://biodnd.com/contact
        </a>
      </p>,
    ],
  },
  {
    question: "Can I switch plans after upgrading?",
    answer: [
      <p key="p1">Yes.</p>,
      <ul key="ul1" className="list-disc pl-5">
        <li>
          If you’d like to upgrade to the Enterprise plan, please contact our
          sales team for assistance:{" "}
          <a
            href="https://biodnd.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-color underline"
          >
            https://biodnd.com/contact
          </a>
        </li>
        <li>
          Pro users can switch between monthly and annual billing in the account
          settings.
          <ul className="list-disc pl-7 mt-1">
            <li>
              If switching from monthly to annual, the next payment will be
              charged after 365 days.
            </li>
            <li>
              If switching from annual to monthly, the new billing cycle will
              begin after the current annual term ends.
            </li>
          </ul>
        </li>
      </ul>,
    ],
  },
  {
    question:
      "Are BIODND’s data sources reliable? How is data accuracy ensured?",
    answer: [
      <p key="p1">
        BIODND sources its data from trusted partners, participating companies,
        publicly available research reports, clinical trial registries,
        financial disclosures, and market trend analyses.
        <br />
        Our system updates data regularly to ensure both timeliness and accuracy
        of the information provided.
      </p>,
    ],
  },
];

// FAQ section layout
const Faq = () => {
  return (
    <section className="w-full py-32 px-8 md:px-16 lg:px-20 xl:px-28 self-stretch bg-[radial-gradient(ellipse_121.50%_121.50%_at_50.00%_50.00%,_white_0%,_rgba(209,_213,_219,_0.80)_100%)] inline-flex flex-col justify-center items-center overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-center">
        <div className="w-full max-w-[1200px] flex flex-col justify-start items-center gap-11">
          <div className="self-stretch inline-flex justify-start md:justify-center items-center gap-2.5">
            <h2 className="self-stretch text-black text-24px md:text-36px font-bold leading-140">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-5">
            {FaqContent.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Faq;
