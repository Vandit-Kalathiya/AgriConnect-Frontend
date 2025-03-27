import { getGeminiResponse, createAgriculturalPrompt } from './GeminiService';

const responseCache = new Map();

export const getChatResponse = async (messages, language) => {
  try {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    const cacheKey = `${lastUserMessage.text}_${language}`;
    
    if (responseCache.has(cacheKey)) {
      return { text: responseCache.get(cacheKey) || '' };
    }
    
    let response;
    
    const conversationHistory = messages.length > 2 
      ? messages.slice(-3)
      : messages;
    
    try {
      response = await getGeminiResponse(conversationHistory, language);
    } catch (error) {
      console.log("Error with conversation history, trying with single message:", error);
      
      const enhancedPrompt = createAgriculturalPrompt(lastUserMessage.text, language);
      const singleMessage = {
        ...lastUserMessage,
        text: enhancedPrompt,
      };
      
      response = await getGeminiResponse([singleMessage], language);
    }
    
    if (responseCache.size > 100) {
      const oldestKey = responseCache.keys().next().value;
      responseCache.delete(oldestKey);
    }
    responseCache.set(cacheKey, response);
    
    return { text: response };
  } catch (error) {
    console.error('Error getting chat response:', error);
    return {
      text: getFallbackResponse(language),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getFallbackResponse = (language) => {
  const fallbackResponses = {
    'en': "I'm sorry, I couldn't process your request right now. Please try again or ask a different question about farming.",
    'hi': "मुझे क्षमा करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका। कृपया फिर से प्रयास करें या खेती के बारे में कोई अलग प्रश्न पूछें।",
    'bn': "আমি দুঃখিত, আমি এই মুহূর্তে আপনার অনুরোধ প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন বা কৃষি সম্পর্কে একটি ভিন্ন প্রশ্ন জিজ্ঞাসা করুন।",
    'te': "క్షమించండి, నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా వ్యవసాయం గురించి వేరే ప్రశ్న అడగండి.",
    'mr': "क्षमस्व, मी सध्या आपल्या विनंतीवर प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा किंवा शेती विषयी वेगळा प्रश्न विचारा.",
    'ta': "மன்னிக்கவும், நான் இப்போது உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது விவசாயம் பற்றி வேறு கேள்வியைக் கேளுங்கள்。",
    'ur': "معذرت، میں ابھی آپکی درخواست پر عمل نہیں کر سکا۔ براہ کرم دوبارہ کوشش کریں یا کھیتی باڑی کے بارے میں کوئی مختلف سوال پوچھیں۔",
    'gu': "માફ કરશો, હું હાલમાં તમારી વિનંતી પર પ્રક્રિયા કરી શક્યો નથી. કૃપા કરીને ફરીથી પ્રયાસ કરો અથવા ખેતી વિશે અલગ પ્રશ્ન પૂછો.",
    'kn': "ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಕೃಷಿಯ ಬಗ್ಗೆ ಬೇರೆ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.",
    'ml': "ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ കൃഷിയെക്കുറിച്ച് മറ്റൊരു ചോദ്യം ചോദിക്കുക。",
    'pa': "ਮੁਆਫ ਕਰਨਾ, ਮੈਂ ਫਿਲਹਾਲ ਤੁਹਾਡੀ ਬੇਨਤੀ 'ਤੇ ਕਾਰਵਾਈ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਕੋਈ ਵੱਖਰਾ ਸਵਾਲ ਪੁੱਛੋ।",
    'or': "କ୍ଷମା କରନ୍ତୁ, ମୁଁ ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ଅନୁରୋଧକୁ ପ୍ରକ୍ରିୟାକରଣ କରିପାରିଲି ନାହିଁ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ କିମ୍ବା କୃଷି ବିଷୟରେ ଏକ ଭିନ୍ନ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
    'as': "ক্ষমা কৰিব, মই এতিয়া আপোনাৰ অনুৰোধ প্ৰক্ৰিয়াকৰণ কৰিব পৰা নাই। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক বা কৃষি সম্পৰ্কে এটা বেলেগ প্ৰশ্ন সোধক।"
  };
  
  return fallbackResponses[language];
};