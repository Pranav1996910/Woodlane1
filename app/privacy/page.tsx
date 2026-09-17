import type { Metadata } from "next"
import { LegalPage, type LegalSection } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How WoodLane collects, uses and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  // Replace with your company details
  const companyName = "Woodlane";
  const websiteUrl = "www.woodlane.com";
  const companyEmail = "woodlanedoors@gmail.com";
  const effectiveDate = "December 15, 2025";

  const policySections: LegalSection[] = [
    {
      title: "1. Information We Collect",
      content: [
        {
          heading: "Personal Data:",
          text: `We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website (such as posting messages in our forums or entering competitions), or otherwise when you contact us. This may include:
          \n- **Contact Data:** Name, email address, phone number, and mailing address.
          \n- **Transaction Data:** Information related to purchases, payments, and product inquiries.
          \n- **Account Data:** Username and password (for registered users).`,
        },
        {
          heading: "Non-Personal Data:",
          text: `We automatically collect certain information when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Website.`,
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        {
          text: `We use personal information collected via our Website for a variety of business purposes, including:
          \n- **To fulfill and manage orders:** To process payments, orders, returns, and exchanges made through the Website.
          \n- **To send you marketing and promotional communications:** If you opt-in to marketing, we may use your information to send you updates about new products, services, or offers. You can opt-out at any time.
          \n- **To post testimonials:** We may post testimonials on our Website that may contain personal information. We will obtain your consent to use your name and the content of the testimonial.
          \n- **To protect our Website:** As part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).
          \n- **To administer your account:** To maintain your account and ensure its functionality.`,
        },
      ],
    },
    {
      title: "3. Will Your Information Be Shared With Anyone?",
      content: [
        {
          text: `We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data based on the following legal basis:
          \n- **Consent:** We may process your data if you have given us specific consent to use your personal information for a specific purpose.
          \n- **Legitimate Interests:** We may process your data when it is reasonably necessary to achieve our legitimate business interests.
          \n- **Legal Obligations:** We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.`,
        },
      ],
    },
    {
      title: "4. Cookies and Tracking Technologies",
      content: [
        {
          text: `We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our separate [Link to Cookie Policy, if applicable] Cookie Policy.`,
        },
      ],
    },
    {
      title: "5. Your Privacy Rights",
      content: [
        {
          text: `In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. Your rights may include: the right to access, the right to rectification, the right to erasure, the right to restrict processing, and the right to data portability. You may exercise any of these rights by contacting us using the contact details provided below.`,
        },
      ],
    },
    {
      title: "6. Updates to This Policy",
      content: [
        {
          text: `We may update this privacy policy from time to time. The updated version will be indicated by an updated "Effective Date" and the updated version will be effective as soon as it is accessible. We encourage you to review this policy frequently to be informed of how we are protecting your information.`,
        },
      ],
    },
    {
      title: "7. How Can You Contact Us About This Policy?",
      content: [
        {
          text: `If you have questions or comments about this policy, you may contact us by email at **${companyEmail}** or by mail at: [Your Company Address].`,
        },
      ],
    },
  ];


  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate={effectiveDate}
      intro={`This privacy policy governs the privacy of our website, ${websiteUrl}, and the services we provide. ${companyName} is committed to protecting your personal information and your right to privacy.`}
      sections={policySections}
      closing="Thank you for trusting us with your data."
    />
  )
}
