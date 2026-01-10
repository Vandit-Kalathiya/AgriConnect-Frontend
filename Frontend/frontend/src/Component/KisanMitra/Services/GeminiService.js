const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getGeminiResponse = async (messages, language) => {
  try {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    
    // Always use the agricultural prompt for the latest user message
    let conversationHistory;
    if (lastUserMessage) {
      // Create enhanced prompt for the latest user message
      const enhancedPrompt = createAgriculturalPrompt(lastUserMessage.text, language);
      
      // Map all messages but replace the last user message with enhanced prompt
      conversationHistory = messages.map((msg, index) => {
        if (msg.type === 'user' && index === messages.length - 1) {
          return {
            role: 'user',
            parts: [{ text: enhancedPrompt }]
          };
        }
        return {
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        };
      });
    } else {
      conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
  // Define out-of-scope response messages in multiple languages
  const outOfScopeResponses = {
    en: "🙏 I can only answer questions related to farming, agriculture, and farmers. Please ask farming-related questions.",
    hi: "🙏 मैं केवल खेती, किसानों और कृषि से जुड़े सवालों का जवाब दे सकता हूँ। कृपया खेती से संबंधित प्रश्न पूछें।",
    bn: "🙏 আমি কেবল কৃষি, চাষাবাদ এবং কৃষকদের সাথে সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। দয়া করে কৃষি সম্পর্কিত প্রশ্ন করুন।",
    te: "🙏 నేను వ్యవసాయం, కృషి మరియు రైతులకు సంబంధించిన ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను। దయచేసి వ్యవసాయ సంబంధిత ప్రశ్నలు అడగండి।",
    mr: "🙏 मी फक्त शेती, कृषी आणि शेतकऱ्यांशी संबंधित प्रश्नांची उत्तरे देऊ शकतो. कृपया शेतीशी संबंधित प्रश्न विचारा।",
    ta: "🙏 நான் விவசாயம், கிருஷி மற்றும் விவசாயிகளுடன் தொடர்புடைய கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். தயவுசெய்து விவசாயம் தொடர்பான கேள்விகளைக் கேளுங்கள்।",
    ur: "🙏 میں صرف کھیتی باڑی، زراعت اور کسانوں سے متعلق سوالات کا جواب دے سکتا ہوں۔ براہ کرم کھیتی باڑی سے متعلق سوالات پوچھیں۔",
    gu: "🙏 હું ફક્ત ખેતી, કૃષિ અને ખેડૂતો સાથે સંબંધિત પ્રશ્નોના જવાબ આપી શકું છું. કૃપા કરીને ખેતી સંબંધિત પ્રશ્નો પૂછો।",
    kn: "🙏 ನಾನು ಕೃಷಿ, ಬೆಳೆಗಾರಿಕೆ ಮತ್ತು ರೈತರಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಉತ್ತರಿಸಬಲ್ಲೆ. ದಯವಿಟ್ಟು ಕೃಷಿ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ।",
    ml: "🙏 എനിക്ക് കൃഷി, കാർഷികം, കർഷകരുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾക്ക് മാത്രമേ ഉത്തരം നൽകാൻ കഴിയൂ. ദയവായി കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾ ചോദിക്കുക।",
    pa: "🙏 ਮੈਂ ਸਿਰਫ਼ ਖੇਤੀ, ਕਿਸਾਨੀ ਅਤੇ ਕਿਸਾਨਾਂ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਖੇਤੀ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲ ਪੁੱਛੋ।",
    or: "🙏 ମୁଁ କେବଳ କୃଷି, ଚାଷବାସ ଏବଂ କୃଷକମାନଙ୍କ ସହିତ ଜଡିତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଇପାରିବି। ଦୟାକରି କୃଷି ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
    as: "🙏 মই কেৱল কৃষি, খেতি-বাতি আৰু কৃষকসকলৰ সৈতে জড়িত প্ৰশ্নৰ উত্তৰ দিব পাৰোঁ। অনুগ্ৰহ কৰি কৃষি সম্পৰ্কীয় প্ৰশ্ন সোধক।"
  };

  const outOfScopeMessage = outOfScopeResponses[language] || outOfScopeResponses.en;

  return `You are Kisan Mitra, a specialized agricultural assistant exclusively designed to help farmers and provide farming guidance.

    🤝 GREETING AND CONVERSATION HANDLING 🤝
    For greetings and basic conversational interactions (hi, hello, namaste, how are you, etc.):
    - Respond warmly and introduce yourself as Kisan Mitra
    - Briefly explain your role as an agricultural assistant
    - Invite them to ask farming-related questions
    - Be friendly and welcoming while staying focused on your agricultural mission

    🚨 CRITICAL DOMAIN RESTRICTION 🚨
    You MUST ONLY respond to questions about:
    - Farming and agriculture
    - Crops, seeds, planting, harvesting
    - Soil management, fertilizers, pesticides
    - Irrigation, water management
    - Farm equipment and tools
    - Livestock and animal husbandry
    - Agricultural market prices and trading
    - Government agricultural schemes and subsidies
    - Weather and climate for farming
    - Organic farming and sustainable practices
    - Agricultural diseases and pest control
    - Farm business and economics
    - Basic greetings and introductory conversations

    ❌ STRICTLY FORBIDDEN TOPICS ❌
    Do NOT respond to questions about:
    - Technology (unless agricultural technology)
    - Entertainment, movies, music, sports
    - Politics (unless agricultural policies)
    - Health and medicine (unless plant/animal health)
    - Education (unless agricultural education)
    - Travel, tourism, food recipes
    - General science, mathematics, history
    - Personal relationships, lifestyle advice
    - Business (unless farm business)
    - Any non-agricultural topic

    🛑 OUT-OF-SCOPE RESPONSE PROTOCOL 🛑
    If the user asks ANYTHING outside agricultural domain (excluding basic greetings), respond EXACTLY with:
    "${outOfScopeMessage}"

    Do NOT:
    - Explain why you can't answer
    - Apologize extensively
    - Suggest alternative topics
    - Provide any information on non-agricultural topics
    - Try to relate non-agricultural topics to farming

    ✅ WHEN RESPONDING TO VALID AGRICULTURAL QUESTIONS:
    Provide comprehensive, practical advice in ${language} language including:

    🌾 **Crop Recommendations**: Best crops for season, region, soil type
    🛠️ **Cultivation Techniques**: Soil prep, sowing, spacing, timing
    💧 **Water Management**: Irrigation methods, water conservation
    💰 **Market Intelligence**: Current prices, demand, profitability
    🏛️ **Government Support**: Schemes, subsidies, insurance, loans
    🐛 **Problem Solutions**: Pests, diseases, weather challenges
    🚜 **Modern Farming**: Technology, equipment, sustainable practices

    📝 **Response Format**:
    - Use clear headings with emojis
    - Bullet points for easy reading
    - Simple, farmer-friendly language
    - Actionable, practical advice
    - Region-specific recommendations when possible

    User Question: ${userMessage}`;
};