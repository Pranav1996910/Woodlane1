import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the WoodLane website and services.",
}

export default function TermsOfUsePage() {
  // Replace with your company details
  const companyName = "Woodlane";
  const websiteUrl = "www.woodlane.com";
  const companyEmail = "woodlanedoors@gmail.com";
  const effectiveDate = "December 15, 2025";

  // Define a type for strong TypeScript safety (addresses previous issue)
  type TermsContent = {
    heading?: string; // Optional property
    text: string;
  }

  type TermsSection = {
    title: string;
    content: TermsContent[];
  }

  const termsSections: TermsSection[] = [
    {
      title: "1. Agreement to Terms",
      content: [
        {
          text: `These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ${companyName}, concerning your access to and use of the ${websiteUrl} website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site"). You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.`,
        },
      ],
    },
    {
      title: "2. Intellectual Property Rights",
      content: [
        {
          text: `Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws. The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.`,
        },
      ],
    },
    {
      title: "3. User Representations",
      content: [
        {
          text: `By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are not a minor in the jurisdiction in which you reside; and (5) your use of the Site will not violate any applicable law or regulation.`,
        },
      ],
    },
    {
      title: "4. Prohibited Activities",
      content: [
        {
          text: `You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include, but are not limited to:`,
        },
        {
          heading: "Examples of Prohibited Activities:",
          text: `\n- Systematic retrieval of data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
          \n- Making any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email.
          \n- Engaging in unauthorized framing of or linking to the Site.
          \n- Uploading or transmitting (or attempting to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site.`,
        },
      ],
    },
    {
      title: "5. Termination",
      content: [
        {
          text: `These Terms of Use shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF USE OR OF ANY APPLICABLE LAW OR REGULATION.`,
        },
      ],
    },
    {
      title: "6. Disclaimer of Warranties",
      content: [
        {
          text: `THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`,
        },
      ],
    },
    {
      title: "7. Governing Law",
      content: [
        {
          text: `These Terms shall be governed by and defined by the laws of [Insert Governing State/Country] without regard to its conflict of laws principles. The United Nations Convention on Contracts for the International Sale of Goods does not apply to these Terms.`,
        },
      ],
    },
    {
      title: "8. Contact Us",
      content: [
        {
          text: `In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: **${companyEmail}**`,
        },
      ],
    },
  ];


  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate={effectiveDate}
      intro={`These terms govern your use of ${websiteUrl} and any services ${companyName} provides through it. By using the site you agree to them.`}
      sections={termsSections}
    />
  )
}
