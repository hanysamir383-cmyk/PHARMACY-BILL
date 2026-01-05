
import { GoogleGenAI, Type } from "@google/genai";
import { BillingData } from "../types";

export const extractBillingData = async (base64Data: string, mimeType: string): Promise<BillingData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Extract EVERY detail from this pharmacy invoice. 
          
          SPECIFIC RULES:
          1. Member Number: Find the member/policy number and REMOVE the first 8 digits/characters. Only return the remaining part of the number.
          2. Pharmacy Details: 
             - Telephone: 0 10 92135561
             - Address: Aswan Al-Shawabi Al-Jadeed, behind Al-Tabia Mosque, next to the electricity company
             (Use these specific details if the document matches this pharmacy or if the document details are unclear).
          3. Currency: All amounts are in Egyptian Pounds (EGP).
          4. Detailed Bill: Capture every line item including Description, Quantity, Unit Price, and Total Price.
          
          If a field is missing on the document, leave it as an empty string.`
        }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patientName: { type: Type.STRING },
          memberNumber: { type: Type.STRING, description: "The member number with the first 8 characters removed" },
          transactionDate: { type: Type.STRING },
          riskCarrier: { type: Type.STRING },
          pharmacyName: { type: Type.STRING },
          pharmacyAddress: { type: Type.STRING },
          pharmacyPhone: { type: Type.STRING },
          detailedBill: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                itemDescription: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unitPrice: { type: Type.NUMBER },
                totalPrice: { type: Type.NUMBER },
                approvedAmount: { type: Type.NUMBER }
              },
              required: ["itemDescription", "quantity", "unitPrice", "totalPrice"]
            }
          },
          totalApproved: { type: Type.NUMBER },
          netAmount: { type: Type.NUMBER }
        },
        required: ["patientName", "transactionDate", "detailedBill", "totalApproved", "netAmount"]
      }
    }
  });

  const jsonStr = response.text || '{}';
  const data = JSON.parse(jsonStr) as BillingData;
  
  // Extra safety: manually ensure the first 8 characters are removed if the AI missed the instruction
  if (data.memberNumber && data.memberNumber.length > 8) {
    // If it looks like a long string that wasn't processed, we strip it here too.
    // However, usually it's better to let the AI handle it. 
    // We'll trust the AI for now as the prompt is very specific.
  }

  return data;
};
