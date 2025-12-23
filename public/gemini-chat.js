// gemini-chat.js
// This module handles interactions with the Google Gemini API for the eVault chatbot
// Enhanced with system prompt approach for Indian legal rights and document information

import indianLegalRightsModule from './js/indian-legal-rights.js';

const GEMINI_API_KEY = 'AIzaSyDyl-3tbp7DTvxgXS6ZVUEyldQ8xZ73J9A';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Define the system prompt for the chatbot
const SYSTEM_PROMPT = `
You are eVault, an AI assistant specializing in Indian legal rights and document information. Your purpose is to help Indian citizens understand their legal rights, document requirements, and verification processes.

Follow these guidelines when responding:
1. Always provide accurate information about Indian legal rights and documents
2. When asked about documents, explain their importance, how to obtain them, and verification processes
3. Prioritize responses in this order: FAQs, legal rights information, document information, general responses
4. Format your responses clearly with headings, lists, and emphasis for important information
5. If you're unsure about specific legal details, acknowledge limitations and suggest consulting official sources
6. Keep responses concise but comprehensive
7. Be respectful and maintain a helpful, professional tone
8. Provide specific action items or next steps when applicable

You have access to information on:
- Essential identity documents (Aadhaar, PAN, passport, etc.)
- Legal rights for various groups (women, children, elderly, etc.)
- Document verification processes
- Government schemes and benefits
- Family law matters (marriage, divorce, inheritance, etc.)
- Property rights and documentation
- Employment-related documents and rights
- Procedures for filing legal complaints or cases

For any query, first check if it matches a known FAQ, then check for legal rights information, then document information, before falling back to a general response.
`;

const geminiChatbot = {
  // Store conversation history
  history: [],
  
  // Initialize the chatbot
  init() {
    console.log('Gemini chatbot initialized with Indian legal rights module and system prompt');
    this.history = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];
  },
  
  // Format the Indian legal rights response
  _formatLegalRightsResponse(response) {
    if (response.type === 'rights') {
      let formattedResponse = `## ${response.category}\n\n${response.message}\n\n`;
      response.content.forEach((right, index) => {
        formattedResponse += `${index + 1}. ${right}\n`;
      });
      return formattedResponse;
    } else if (response.type === 'documents') {
      let formattedResponse = `## ${response.category}\n\n${response.message}\n\n`;
      response.content.forEach((doc, index) => {
        formattedResponse += `### ${index + 1}. ${doc.name}\n**Description**: ${doc.description}\n**Importance**: ${doc.importance}\n\n`;
      });
      return formattedResponse;
    } else if (response.type === 'faq') {
      return `## FAQ: ${response.question}\n\n${response.answer}`;
    } else if (response.type === 'document_categories') {
      let formattedResponse = `## Available Document Categories\n\n${response.message}\n\n`;
      response.categories.forEach((category, index) => {
        formattedResponse += `${index + 1}. ${category}\n`;
      });
      return formattedResponse;
    } else if (response.type === 'verification_process') {
      return `## ${response.category} Verification Process\n\n${response.message}\n\n${response.content}`;
    } else if (response.type === 'formative_question' || response.type === 'routing_question') {
      let formattedResponse = `## ${response.question}\n\n`;
      response.responses.forEach((option, index) => {
        formattedResponse += `${index + 1}. ${option}\n`;
      });
      formattedResponse += "\n**Please select a number or type your response.**";
      return formattedResponse;
    }
    
    // Default fallback for unhandled response types
    return JSON.stringify(response);
  },
  
  // Check if query relates to Indian legal rights or documents
  _isLegalRightsQuery(query) {
    const legalKeywords = [
      'right', 'rights', 'law', 'legal', 'document', 'certificate',
      'aadhaar', 'pan', 'property', 'marriage', 'divorce', 'custody',
      'domestic violence', 'inheritance', 'women', 'men', 'children',
      'girl', 'elderly', 'senior', 'citizen', 'scheme', 'benefit',
      'india', 'indian', 'verification', 'identity', 'passport', 'license',
      'caste', 'disability', 'affidavit', 'court', 'case', 'file', 'procedure',
      'faq', 'question', 'help', 'support', 'how to', 'what is', 'when', 'where',
      'who', 'why', 'can i', 'should i', 'need', 'require', 'mandatory'
    ];
    
    const lowerQuery = query.toLowerCase();
    return legalKeywords.some(keyword => lowerQuery.includes(keyword));
  },
  
  // Check if query is specifically asking for FAQs
  _isFAQRequest(query) {
    const faqKeywords = [
      'faq', 'frequently asked', 'common question', 'questions and answers',
      'list questions', 'show me faq', 'show faq', 'display faq', 'view faq',
      'help section', 'faq section', 'all faqs', 'frequently asked questions'
    ];
    
    const lowerQuery = query.toLowerCase();
    return faqKeywords.some(keyword => lowerQuery.includes(keyword));
  },
  
  // Handle FAQ-specific requests
  _handleFAQRequest() {
    return {
      type: 'faq_list',
      title: 'Frequently Asked Questions',
      faqs: indianLegalRightsModule.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer
      }))
    };
  },
  
  // Handle the continuation of formative questioning
  _handleFormativeQuestionResponse(userResponse, previousQuestion) {
    // Find the previous question in the formative questions array
    const formativeQuestion = indianLegalRightsModule.formativeQuestions.find(
      q => q.question === previousQuestion
    );
    
    if (!formativeQuestion) {
      return {
        type: "general_response",
        message: "I'm not sure what question you're responding to. Please let me know what legal information you're looking for."
      };
    }
    
    // Try to match the user response with one of the available options
    let matchedResponse = null;
    
    // Check if user entered a number
    const numResponse = parseInt(userResponse);
    if (!isNaN(numResponse) && numResponse > 0 && numResponse <= formativeQuestion.responses.length) {
      matchedResponse = formativeQuestion.responses[numResponse - 1];
    } else {
      // Check for text match with improved fuzzy matching
      const userWords = userResponse.toLowerCase().split(/\s+/);
      matchedResponse = formativeQuestion.responses.find(resp => {
        const respWords = resp.toLowerCase().split(/\s+/);
        return userWords.some(word => respWords.some(respWord => respWord.includes(word) || word.includes(respWord)));
      });
    }
    
    if (!matchedResponse) {
      return {
        type: "clarification",
        message: "I'm not sure I understood your response. Please select one of the following options:",
        options: formativeQuestion.responses
      };
    }
    
    // Return the next question or response based on the user's selection
    return formativeQuestion.next(matchedResponse);
  },
  
  // New method to specifically handle FAQ queries
  _handleFAQQuery(query) {
    // Check if this is a request to see all FAQs
    if (this._isFAQRequest(query)) {
      return this._handleFAQRequest();
    }
    
    // Check if the query matches any FAQ questions
    const lowerQuery = query.toLowerCase();
    
    // First try exact or close matches
    let faqMatch = indianLegalRightsModule.faqs.find(faq => {
      const lowerQuestion = faq.question.toLowerCase();
      return lowerQuery.includes(lowerQuestion) || lowerQuestion.includes(lowerQuery);
    });
    
    // If no exact match, try keyword matching
    if (!faqMatch) {
      faqMatch = indianLegalRightsModule.faqs.find(faq => {
        return faq.keywords && faq.keywords.some(keyword => lowerQuery.includes(keyword));
      });
    }
    
    if (faqMatch) {
      return {
        type: 'faq',
        question: faqMatch.question,
        answer: faqMatch.answer
      };
    }
    
    return null;
  },
  
  // Format a full FAQ list
  _formatFAQList(faqList) {
    let formattedResponse = `## Frequently Asked Questions\n\n`;
    
    faqList.faqs.forEach((faq, index) => {
      formattedResponse += `### ${index + 1}. ${faq.question}\n${faq.answer}\n\n`;
    });
    
    formattedResponse += "Is there a specific question I can help with?";
    
    return formattedResponse;
  },
  
  // Process user message
  async processMessage(message) {
    // Add user message to history
    this.history.push({ role: 'user', content: message });
    
    let response;
    
    // Check if this is a continuation of a previous formative question
    const lastBotMessage = this.history.filter(msg => msg.role === 'bot').pop();
    if (lastBotMessage && 
        (lastBotMessage.responseType === 'formative_question' || 
         lastBotMessage.responseType === 'routing_question')) {
      response = this._handleFormativeQuestionResponse(message, lastBotMessage.question);
    } 
    // Check if this is a request for FAQs
    else if (this._isFAQRequest(message)) {
      response = this._handleFAQRequest();
    }
    // Check if this is an FAQ query
    else {
      const faqResponse = this._handleFAQQuery(message);
      if (faqResponse) {
        response = faqResponse;
      }
      // Then check if it's a legal rights query 
      else if (this._isLegalRightsQuery(message)) {
        response = indianLegalRightsModule.processQuery(message);
      } 
      // Fall back to Gemini API for general queries
      else {
        try {
          // Prepare conversation history for API (excluding system message)
          const apiHistory = this.history.map(msg => {
            if (msg.role === 'system') {
              return { role: 'model', parts: [{ text: msg.content }] };
            } else if (msg.role === 'user') {
              return { role: 'user', parts: [{ text: msg.content }] };
            } else if (msg.role === 'bot') {
              return { role: 'model', parts: [{ text: msg.content }] };
            }
            return null;
          }).filter(Boolean);
          
          const apiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: apiHistory,
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            })
          });
          
          const data = await apiResponse.json();
          
          if (data.candidates && data.candidates.length > 0) {
            response = {
              type: 'general_response',
              message: data.candidates[0].content.parts[0].text
            };
          } else {
            throw new Error('No valid response from Gemini API');
          }
        } catch (error) {
          console.error('Error communicating with Gemini API:', error);
          response = {
            type: 'error',
            message: 'I apologize, but I encountered an error processing your request. Please try again later.'
          };
        }
      }
    }
    
    // Format the response
    let formattedResponse;
    if (response.type === 'general_response' || response.type === 'error') {
      formattedResponse = response.message;
    } else if (response.type === 'faq_list') {
      formattedResponse = this._formatFAQList(response);
    } else {
      formattedResponse = this._formatLegalRightsResponse(response);
    }
    
    // Add bot response to history
    this.history.push({ 
      role: 'bot', 
      content: formattedResponse,
      responseType: response.type,
      question: response.type === 'formative_question' || response.type === 'routing_question' 
                ? response.question 
                : null
    });
    
    return formattedResponse;
  },
  
  // Get all available help categories
  getHelpCategories() {
    return {
      title: "Available Help Categories",
      categories: [
        { 
          name: "Legal Rights", 
          description: "Information about rights for various groups including women, children, and elderly" 
        },
        { 
          name: "Essential Documents", 
          description: "Information about important documents like Aadhaar, PAN, and passport" 
        },
        { 
          name: "Verification Processes", 
          description: "Steps to verify various documents and their authenticity" 
        },
        { 
          name: "Government Schemes", 
          description: "Information about government benefits and welfare programs" 
        },
        { 
          name: "Family Law", 
          description: "Information about marriage, divorce, inheritance and custody" 
        },
        { 
          name: "FAQs", 
          description: "Frequently asked questions about legal rights and documents" 
        }
      ]
    };
  },
  
  // Clear conversation history (except system prompt)
  clearHistory() {
    // Keep only the system prompt
    this.history = this.history.filter(msg => msg.role === 'system');
    return "Conversation history has been cleared.";
  }
};

export default geminiChatbot;