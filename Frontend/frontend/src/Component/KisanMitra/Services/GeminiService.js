const GEMINI_API_KEY = 'AIzaSyDU7xQMNUiyJ9SEtvDQCd3jmpgfTGo9kg8';

export const getGeminiResponse = async (messages, language) => {
  try {
    const conversationHistory = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    
    if (conversationHistory.length > 0 && lastUserMessage) {
      const firstMessage = conversationHistory[0];
      if (firstMessage.role === 'user') {
        const languageInstruction = `Answer this in ${language} language, about agriculture: `;
        firstMessage.parts[0].text = languageInstruction + firstMessage.parts[0].text;
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw new Error('Failed to get response from Gemini API');
  }
};

export const createAgriculturalPrompt = (userMessage, language) => {
//   const agricultureKeywords = {
//     en: ['crop', 'farm', 'harvest', 'soil', 'seed', 'plant', 'fertilizer', 'irrigation', 'pesticide', 'weather'],
//     hi: ['फसल', 'खेत', 'कटाई', 'मिट्टी', 'बीज', 'पौधा', 'उर्वरक', 'सिंचाई', 'कीटनाशक', 'मौसम'],
//     bn: ['ফসল', 'খামার', 'ফসল কাটা', 'মাটি', 'বীজ', 'গাছ', 'সার', 'সেচ', 'কীটনাশক', 'আবহাওয়া'],
//     te: ['పంట', 'వ్యవసాయం', 'పంట కోత', 'నేల', 'విత్తనం', 'మొక్క', 'ఎరువు', 'నీటిపారుదల', 'పురుగుమందు', 'వాతావరణం'],
//     mr: ['पीक', 'शेत', 'कापणी', 'माती', 'बियाणे', 'रोपटे', 'खत', 'सिंचन', 'कीटकनाशक', 'हवामान'],
//     ta: ['பயிர்', 'பண்ணை', 'அறுவடை', 'மண்', 'விதை', 'தாவரம்', 'உரம்', 'நீர்ப்பாசனம்', 'பூச்சிக்கொல்லி', 'வானிலை'],
//     ur: ['فصل', 'کھیت', 'کٹائی', 'مٹی', 'بیج', 'پودا', 'کھاد', 'آبپاشی', 'کیڑے مار دوا', 'موسم'],
//     gu: ['પાક', 'ખેતર', 'કાપણી', 'માટી', 'બીજ', 'છોડ', 'ખાતર', 'સિંચાઈ', 'જંતુનાશક', 'હવામાન'],
//     kn: ['ಬೆಳೆ', 'ಕೃಷಿ', 'ಕಟಾವು', 'ಮಣ್ಣು', 'ಬೀಜ', 'ಸಸ್ಯ', 'ಗೊಬ್ಬರ', 'ನೀರಾವರಿ', 'ಕೀಟನಾಶಕ', 'ಹವಾಮಾನ'],
//     ml: ['വിള', 'കൃഷി', 'കൊയ്ത്ത്', 'മണ്ണ്', 'വിത്ത്', 'ചെടി', 'വളം', 'ജലസേചനം', 'കീടനാശിനി', 'കാലാവസ്ഥ'],
//     pa: ['ਫਸਲ', 'ਖੇਤ', 'ਵਾਢੀ', 'ਮਿੱਟੀ', 'ਬੀਜ', 'ਪੌਦਾ', 'ਖਾਦ', 'ਸਿੰਚਾਈ', 'ਕੀਟਨਾਸ਼ਕ', 'ਮੌਸਮ'],
//     or: ['ଫସଲ', 'କୃଷି', 'ଅମଳ', 'ମାଟି', 'ବୀଜ', 'ଗଛ', 'ସାର', 'ଜଳସେଚନ', 'କୀଟନାଶକ', 'ପାଣିପାଗ'],
//     as: ['শস্য', 'কৃষি', 'শস্য চপোৱা', 'মাটি', 'বীজ', 'গছ', 'সাৰ', 'জলসিঞ্চন', 'কীটনাশক', 'বতৰ']
//   };

  return `You are Kisan Mitra, an agricultural assistant helping farmers. Answer in ${language} language. 
  Provide detailed, practical farming advice about: ${userMessage}. 
  Be specific with information on:
  - Best crops for the season and region
  - Cultivation techniques
  - Water management
  - Market prices and profit potential
  - Government schemes and subsidies if applicable
  - Common problems and solutions
  - Modern farming innovations
  
  Format your response clearly with headings and bullet points when appropriate. Use simple language that farmers can easily understand. Provide complete information without cutting off your response.`;
};