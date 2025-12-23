// indian-legal-rights.js
// Module to extend the Gemini chatbot with Indian legal rights information and important document guidance

const indianLegalRightsModule = {
    // Legal rights information by category
    legalRights: {
      general: [
        "Right to Equality (Article 14-18): All citizens are equal before the law regardless of religion, race, caste, gender, or place of birth.",
        "Right to Freedom (Article 19-22): Freedom of speech, expression, assembly, association, movement, residence, and profession.",
        "Right against Exploitation (Article 23-24): Prohibition of human trafficking, forced labor, and child labor.",
        "Right to Freedom of Religion (Article 25-28): Freedom to practice and propagate any religion.",
        "Cultural and Educational Rights (Article 29-30): Protection of interests of minorities.",
        "Right to Constitutional Remedies (Article 32): Right to approach the Supreme Court for enforcement of Fundamental Rights."
      ],
      
      women: [
        "Protection from Sexual Harassment at Workplace (Sexual Harassment of Women at Workplace Act, 2013).",
        "Equal pay for equal work (Equal Remuneration Act, 1976).",
        "Maternity benefits including paid leave for 26 weeks (Maternity Benefit Act, 1961, amended 2017).",
        "Right against domestic violence (Protection of Women from Domestic Violence Act, 2005).",
        "Protection against dowry demands (Dowry Prohibition Act, 1961).",
        "Rights to property and inheritance (Hindu Succession Act amendments, 2005).",
        "Female police officers must be present during arrest of women, and women cannot be arrested after sunset and before sunrise except in exceptional circumstances.",
        "Right to dignity and decency (no arrest or medical examination in absence of female police officer).",
        "Right to free legal aid and speedy justice."
      ],
      
      men: [
        "Right to file domestic violence case as a victim (though laws are primarily designed for women, Supreme Court judgments have recognized male victims).",
        "Right to receive maintenance from wife if unable to maintain himself (Section 24 of Hindu Marriage Act).",
        "Right to child custody (courts now follow the 'welfare of the child' doctrine rather than automatic preference for the mother).",
        "Protection against false allegations through Section 182 IPC (false information with intent to cause public servant to use lawful power to injury).",
        "Right to sexual consent (rape laws still do not recognize male victims fully, but sexual harassment laws offer some protection).",
        "Rights as a father, including guardianship rights under personal laws."
      ],
      
      children: [
        "Right to free and compulsory education between age 6-14 years (Right to Education Act, 2009).",
        "Protection from child labor under age 14 (Child Labor Prohibition Act).",
        "Protection from sexual offenses (POCSO Act, 2012).",
        "Right to nutrition, health and care (Integrated Child Development Services).",
        "Right to be protected from trafficking and exploitation (Juvenile Justice Act, 2015).",
        "Right to parental care and protection.",
        "Right to identity and nationality.",
        "Protection from early and forced marriage (Prohibition of Child Marriage Act, 2006)."
      ],
      
      elderly: [
        "Right to maintenance from children (Maintenance and Welfare of Parents and Senior Citizens Act, 2007).",
        "Right to property and protection from property transfer under coercion.",
        "Rights to healthcare and medical facilities.",
        "Protection against abuse and abandonment.",
        "Right to concessions in public transport and tax benefits."
      ]
    },
    
    // Essential documents categorized by importance and purpose
    essentialDocuments: {
      identity: [
        {
          name: "Aadhaar Card",
          description: "12-digit unique identity number issued by UIDAI, essential for government schemes and services.",
          importance: "Mandatory for tax filing, bank accounts, government subsidies."
        },
        {
          name: "PAN Card",
          description: "Permanent Account Number issued by Income Tax Department.",
          importance: "Required for financial transactions, tax filing, and opening bank accounts."
        },
        {
          name: "Voter ID Card",
          description: "Issued by Election Commission of India.",
          importance: "Proof of citizenship and voting rights."
        },
        {
          name: "Passport",
          description: "International travel document issued by Ministry of External Affairs.",
          importance: "Official ID for international travel and strong identity proof."
        },
        {
          name: "Driving License",
          description: "Permission to drive vehicles, issued by RTO.",
          importance: "Legal requirement for driving and serves as identity proof."
        }
      ],
      
      property: [
        {
          name: "Property Sale Deed",
          description: "Legal document recording transfer of property ownership.",
          importance: "Proves legal ownership of property and essential for any property dispute."
        },
        {
          name: "Land Records/Patta",
          description: "Document showing land ownership and tax details.",
          importance: "Essential for establishing ownership and preventing property disputes."
        },
        {
          name: "Property Tax Receipts",
          description: "Proof of property tax payments.",
          importance: "Required for property transactions and proving rightful ownership."
        },
        {
          name: "Registered Will",
          description: "Legal document stating how property should be distributed after death.",
          importance: "Prevents property disputes among heirs and ensures your wishes are followed."
        },
        {
          name: "Ancestral Property Documents",
          description: "Documents proving inheritance rights.",
          importance: "Crucial for claiming inherited property rights."
        }
      ],
      
      financial: [
        {
          name: "Bank Account Statements",
          description: "Record of banking transactions.",
          importance: "Proof of financial activities and required for loans, visas, etc."
        },
        {
          name: "Income Tax Returns",
          description: "Annual tax filing documents.",
          importance: "Legal requirement and necessary for loans, visas, and financial verification."
        },
        {
          name: "Insurance Policies",
          description: "Life, health, motor, property insurance documents.",
          importance: "Required for claiming insurance benefits and proving coverage."
        },
        {
          name: "Investment Certificates",
          description: "Fixed deposits, mutual funds, shares, bonds documents.",
          importance: "Proof of investments and required for redemption/selling."
        },
        {
          name: "Loan Documents",
          description: "Agreements for any loans taken.",
          importance: "Details loan terms and conditions, essential for loan closure."
        }
      ],
      
      personal: [
        {
          name: "Birth Certificate",
          description: "Official record of birth issued by Municipal Corporation.",
          importance: "Fundamental identity document required for school admission, passport, etc."
        },
        {
          name: "Marriage Certificate",
          description: "Legal proof of marriage.",
          importance: "Required for name change, passport, visa applications as a couple."
        },
        {
          name: "Education Certificates",
          description: "School, college, university degrees and diplomas.",
          importance: "Essential for job applications and higher education."
        },
        {
          name: "Medical Records",
          description: "History of medical treatments and conditions.",
          importance: "Crucial for proper medical care and insurance claims."
        },
        {
          name: "Employment Contracts",
          description: "Job offer letters and employment agreements.",
          importance: "Defines job responsibilities, compensation, and other terms."
        }
      ],
      
      special: [
        {
          name: "Disability Certificate",
          description: "Proof of disability issued by authorized medical authority.",
          importance: "Required for disability benefits, reservations, and accommodations."
        },
        {
          name: "Caste Certificate",
          description: "Document certifying belonging to SC/ST/OBC categories.",
          importance: "Required for reservation benefits in education and employment."
        },
        {
          name: "Senior Citizen Card",
          description: "Proof of senior citizen status.",
          importance: "Access to special benefits, concessions, and welfare schemes."
        },
        {
          name: "Widow Pension Documents",
          description: "Documents required for widow pension scheme.",
          importance: "Essential for availing widow pension and related benefits."
        }
      ]
    },
    
    // Frequently asked questions about legal rights and documents
    faqs: [
      {
        question: "What documents do I need for Aadhaar card registration?",
        answer: "For Aadhaar registration, you need: 1) Proof of Identity (passport, voter ID, etc.), 2) Proof of Address (utility bill, bank statement, etc.), 3) Proof of Date of Birth (birth certificate, school certificate), and 4) Passport-sized photographs. Children require their birth certificate and the Aadhaar card of a parent."
      },
      {
        question: "How can I protect my property rights?",
        answer: "To protect property rights: 1) Keep all original property documents secure (consider eVault), 2) Register all property transactions properly, 3) Pay property taxes on time and keep receipts, 4) Conduct proper verification before buying property, 5) Create a registered will, 6) Get property documents legally verified."
      },
      {
        question: "What documents do I need for filing domestic violence case?",
        answer: "For filing a domestic violence case, you need: 1) Written complaint describing incidents, 2) Medical reports if there are injuries, 3) List of witnesses if any, 4) Photos/evidence of abuse if available, 5) Previous police complaints if filed, 6) Marriage certificate or proof of relationship. Approach the nearest police station or Protection Officer appointed under the Domestic Violence Act."
      },
      {
        question: "How do I file for child custody in India?",
        answer: "For child custody: 1) File a petition in Family Court, 2) Submit proof of marriage/relationship, 3) Child's birth certificate, 4) Income proof to show ability to provide, 5) Evidence of your relationship with the child, 6) Details of the child's education and current living conditions. Courts decide based on 'best interest of the child' principle."
      },
      {
        question: "What are the inheritance rights for women in India?",
        answer: "Women's inheritance rights in India: 1) Hindu women have equal rights as sons in ancestral property (after 2005 amendment), 2) Daughters have rights in father's self-acquired property, 3) Wives have right to inherit husband's property, 4) Muslim women inherit according to Sharia law (generally 1/2 of brother's share), 5) Christian and Parsi women follow their respective personal laws or Indian Succession Act."
      },
      {
        question: "What documents do I need for passport application?",
        answer: "For passport application: 1) Aadhaar card, 2) Birth certificate or proof of date of birth, 3) Address proof (utility bill, etc.), 4) PAN card, 5) Education certificates if applicable, 6) Previous passport if any, 7) Marriage certificate for married applicants who want spouse name included. Apply online at passport.gov.in and schedule an appointment at Passport Seva Kendra."
      },
      {
        question: "How can I get legal aid if I cannot afford a lawyer?",
        answer: "For free legal aid: 1) Contact the nearest District Legal Services Authority (DLSA), 2) Visit National Legal Services Authority website (nalsa.gov.in), 3) Approach legal aid clinics at law schools, 4) Contact NGOs providing legal assistance, 5) Use the NALSA helpline at 15100. Free legal aid is available to women, children, people with disabilities, SC/ST members, industrial workers, disaster victims, and persons with annual income below specified limits."
      }
    ],
    
    // Formative questions to help users navigate their legal needs
    formativeQuestions: [
      {
        question: "Are you facing issues related to property or inheritance?",
        responses: ["Yes, property disputes", "Yes, inheritance issues", "No, other legal matters"],
        followUp: {
          "Yes, property disputes": ["What type of property is involved?", "Do you have the original property documents?", "Is the property registered in your name?"],
          "Yes, inheritance issues": ["Is there a will?", "What is your relationship to the deceased?", "Are there other claimants to the property?"],
          "No, other legal matters": ["Please specify the nature of your legal concern."]
        }
      },
      {
        question: "Are you dealing with family law matters?",
        responses: ["Marriage-related", "Divorce proceedings", "Child custody", "Domestic violence", "None of these"],
        followUp: {
          "Marriage-related": ["Do you have your marriage certificate?", "What specific marriage-related issue are you facing?"],
          "Divorce proceedings": ["Have you consulted a lawyer?", "Are there children involved?", "Are there property disputes?"],
          "Child custody": ["What is the current custody arrangement?", "Do you have the child's birth certificate and other relevant documents?"],
          "Domestic violence": ["Are you in a safe environment now?", "Have you filed a police complaint?", "Do you need information on protection orders?"],
          "None of these": ["Please specify your family law concern."]
        }
      },
      {
        question: "Do you need help with employment-related legal issues?",
        responses: ["Workplace discrimination", "Salary/benefits disputes", "Wrongful termination", "Sexual harassment", "None of these"],
        followUp: {
          "Workplace discrimination": ["What is the nature of discrimination?", "Do you have your employment contract?", "Have you reported to HR?"],
          "Salary/benefits disputes": ["Do you have documentation of promised salary/benefits?", "Have you tried resolving with employer?"],
          "Wrongful termination": ["Do you have termination letter?", "What reason was given for termination?"],
          "Sexual harassment": ["Have you reported to Internal Complaints Committee?", "Do you need information on filing a complaint?"],
          "None of these": ["Please specify your employment concern."]
        }
      },
      {
        question: "Are you seeking information about government schemes or benefits?",
        responses: ["Women-specific schemes", "Child welfare schemes", "Senior citizen benefits", "Disability benefits", "General welfare schemes"],
        followUp: {
          "Women-specific schemes": ["What is your current employment status?", "Do you need educational, business, or healthcare support?"],
          "Child welfare schemes": ["What is the age of the child?", "Is this related to education, health, or protection?"],
          "Senior citizen benefits": ["Do you have a senior citizen card?", "Are you looking for pension, healthcare, or other benefits?"],
          "Disability benefits": ["Do you have a disability certificate?", "What type of support are you looking for?"],
          "General welfare schemes": ["Please specify your area of interest for welfare schemes."]
        }
      },
      {
        question: "Which essential documents do you need information about?",
        responses: ["Identity documents", "Property documents", "Financial documents", "Personal documents", "Special category documents"],
        followUp: {
          "Identity documents": ["Which specific identity document do you need information about?"],
          "Property documents": ["Is this about purchasing, selling, or securing property documents?"],
          "Financial documents": ["Which financial documents are you interested in?"],
          "Personal documents": ["Which personal document do you need information about?"],
          "Special category documents": ["Which special category document are you looking for?"]
        }
      }
    ],
    
    // Information about legal document verification processes
    verificationProcesses: {
      property: "Property documents can be verified through the Sub-Registrar's Office or by checking the land records at the local revenue office. Many states now offer online verification through their land record portals like 'Bhoomi' in Karnataka or 'Bhulekh' in Uttar Pradesh.",
      
      identity: "Aadhaar can be verified online at the UIDAI website. PAN verification is available through the Income Tax Department portal. Voter ID can be verified through the Election Commission website. Educational certificates can be verified through the respective board or university.",
      
      legal: "Legal documents like affidavits, power of attorney, and wills need to be notarized by a government-appointed Notary Public. Wills should be registered at the Sub-Registrar's office for stronger legal standing, though registration is optional.",
      
      educational: "Educational certificates can be verified through NAD (National Academic Depository) which is a digital depository of academic awards. Various universities also provide verification services, sometimes for a fee."
    },
    
    // Function to handle legal rights queries
    handleLegalRightsQuery(query) {
      query = query.toLowerCase();
      
      // Check for category matches
      if (query.includes("women") || query.includes("woman") || query.includes("female")) {
        return {
          type: "rights",
          category: "Women's Rights",
          content: this.legalRights.women,
          message: "Here are the important legal rights for women in India:"
        };
      } else if (query.includes("men") || query.includes("man") || query.includes("male")) {
        return {
          type: "rights",
          category: "Men's Rights",
          content: this.legalRights.men,
          message: "Here are important legal rights for men in India:"
        };
      } else if (query.includes("child") || query.includes("children") || query.includes("minor") || query.includes("girl")) {
        return {
          type: "rights",
          category: "Children's Rights",
          content: this.legalRights.children,
          message: "Here are important legal rights for children in India:"
        };
      } else if (query.includes("senior") || query.includes("elderly") || query.includes("old age")) {
        return {
          type: "rights",
          category: "Elderly Rights",
          content: this.legalRights.elderly,
          message: "Here are important legal rights for senior citizens in India:"
        };
      } else {
        // General rights if no specific category matches
        return {
          type: "rights",
          category: "Fundamental Rights",
          content: this.legalRights.general,
          message: "Here are the fundamental rights guaranteed to all citizens in India:"
        };
      }
    },
    
    // Function to handle document-related queries
    handleDocumentQuery(query) {
      query = query.toLowerCase();
      
      // Check for document category matches
      if (query.includes("identity") || query.includes("id") || query.includes("aadhaar") || query.includes("pan") || query.includes("identification")) {
        return {
          type: "documents",
          category: "Identity Documents",
          content: this.essentialDocuments.identity,
          message: "Here are important identity documents every Indian citizen should secure:"
        };
      } else if (query.includes("property") || query.includes("land") || query.includes("house") || query.includes("real estate")) {
        return {
          type: "documents",
          category: "Property Documents",
          content: this.essentialDocuments.property,
          message: "Here are essential property documents you should keep secure:"
        };
      } else if (query.includes("financial") || query.includes("bank") || query.includes("money") || query.includes("tax") || query.includes("investment")) {
        return {
          type: "documents",
          category: "Financial Documents",
          content: this.essentialDocuments.financial,
          message: "Here are important financial documents you should maintain:"
        };
      } else if (query.includes("personal") || query.includes("birth") || query.includes("marriage") || query.includes("education") || query.includes("medical")) {
        return {
          type: "documents",
          category: "Personal Documents",
          content: this.essentialDocuments.personal,
          message: "Here are essential personal documents everyone should have:"
        };
      } else if (query.includes("disability") || query.includes("caste") || query.includes("sc") || query.includes("st") || query.includes("obc") || query.includes("widow")) {
        return {
          type: "documents",
          category: "Special Category Documents",
          content: this.essentialDocuments.special,
          message: "Here are important documents for special categories:"
        };
      } else {
        // If no specific match, return a list of all document categories
        return {
          type: "document_categories",
          message: "I can provide information about several types of essential documents. Please specify which category you're interested in:",
          categories: [
            "Identity Documents (Aadhaar, PAN, Voter ID, etc.)",
            "Property Documents (Sale Deed, Land Records, etc.)",
            "Financial Documents (Bank Statements, Tax Returns, etc.)",
            "Personal Documents (Birth Certificate, Marriage Certificate, etc.)",
            "Special Category Documents (Disability, Caste Certificates, etc.)"
          ]
        };
      }
    },
    
    // Function to find matching FAQs
    findMatchingFAQ(query) {
      query = query.toLowerCase();
      
      // Try to find direct matches in FAQs
      for (const faq of this.faqs) {
        const questionLower = faq.question.toLowerCase();
        
        // Check for significant keyword matches
        if (
          (questionLower.includes("aadhaar") && query.includes("aadhaar")) ||
          (questionLower.includes("property") && query.includes("property")) ||
          (questionLower.includes("domestic violence") && query.includes("domestic violence")) ||
          (questionLower.includes("child custody") && query.includes("child custody")) ||
          (questionLower.includes("inheritance") && query.includes("inheritance")) ||
          (questionLower.includes("passport") && query.includes("passport")) ||
          (questionLower.includes("legal aid") && query.includes("legal aid"))
        ) {
          return {
            type: "faq",
            question: faq.question,
            answer: faq.answer
          };
        }
      }
      
      // If no direct match, return null
      return null;
    },
    
    // Function to start formative questioning
    startFormativeQuestioning(query) {
      query = query.toLowerCase();
      
      // Determine which formative question set to begin with
      if (query.includes("property") || query.includes("inheritance") || query.includes("land") || query.includes("house")) {
        return {
          type: "formative_question",
          question: this.formativeQuestions[0].question,
          responses: this.formativeQuestions[0].responses
        };
      } else if (query.includes("family") || query.includes("marriage") || query.includes("divorce") || query.includes("custody") || query.includes("domestic")) {
        return {
          type: "formative_question",
          question: this.formativeQuestions[1].question,
          responses: this.formativeQuestions[1].responses
        };
      } else if (query.includes("job") || query.includes("work") || query.includes("employment") || query.includes("salary") || query.includes("workplace")) {
        return {
          type: "formative_question",
          question: this.formativeQuestions[2].question,
          responses: this.formativeQuestions[2].responses
        };
      } else if (query.includes("scheme") || query.includes("benefit") || query.includes("welfare") || query.includes("government")) {
        return {
          type: "formative_question",
          question: this.formativeQuestions[3].question,
          responses: this.formativeQuestions[3].responses
        };
      } else if (query.includes("document") || query.includes("certificate") || query.includes("id") || query.includes("identification")) {
        return {
          type: "formative_question",
          question: this.formativeQuestions[4].question,
          responses: this.formativeQuestions[4].responses
        };
      } else {
        // If no match, begin with a general routing question
        return {
          type: "routing_question",
          question: "What type of legal information are you looking for?",
          responses: [
            "Legal rights information",
            "Document-related information",
            "Legal processes or procedures",
            "Government schemes or benefits",
            "Other legal queries"
          ]
        };
      }
    },
    
    // Main function to process queries about Indian legal rights and documents
    processQuery(query) {
      // First check if it's a direct FAQ match
      const faqMatch = this.findMatchingFAQ(query);
      if (faqMatch) {
        return faqMatch;
      }
      
      // Check for specific keywords to determine the type of query
      const lowerQuery = query.toLowerCase();
      
      if (
        lowerQuery.includes("right") || 
        lowerQuery.includes("rights") || 
        lowerQuery.includes("law") || 
        lowerQuery.includes("legal protection") ||
        lowerQuery.includes("entitled to")
      ) {
        return this.handleLegalRightsQuery(query);
      } else if (
        lowerQuery.includes("document") ||
        lowerQuery.includes("certificate") ||
        lowerQuery.includes("papers") ||
        lowerQuery.includes("id") ||
        lowerQuery.includes("identification") ||
        lowerQuery.includes("proof")
      ) {
        return this.handleDocumentQuery(query);
      } else if (
        lowerQuery.includes("how to") ||
        lowerQuery.includes("process") ||
        lowerQuery.includes("procedure") ||
        lowerQuery.includes("steps") ||
        lowerQuery.includes("verify") ||
        lowerQuery.includes("validation")
      ) {
        // For procedural questions, we'll try to provide verification info
        for (const [key, value] of Object.entries(this.verificationProcesses)) {
          if (lowerQuery.includes(key)) {
            return {
              type: "verification_process",
              category: key.charAt(0).toUpperCase() + key.slice(1) + " Verification",
              content: value,
              message: `Here's information about verifying ${key} documents:`
            };
          }
        }
        
        // If no specific process match, start formative questioning
        return this.startFormativeQuestioning(query);
      } else {
        // For general or unclear queries, start formative questioning
        return this.startFormativeQuestioning(query);
      }
    }
  };
  
  export default indianLegalRightsModule;