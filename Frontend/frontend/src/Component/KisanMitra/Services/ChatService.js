import { getGeminiResponse, createAgriculturalPrompt } from './GeminiService';
import { isAgriculturalQuery, getOutOfScopeResponse } from './KeywordFilterService';

const responseCache = new Map();

export const getChatResponse = async (messages, language) => {
  try {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    // Check if the query is agricultural using client-side filtering
    if (!isAgriculturalQuery(lastUserMessage.text, language)) {
      // Return out-of-scope response immediately without calling API
      return { text: getOutOfScopeResponse(language) };
    }
    
    // Don't cache if it's a follow-up question (conversation has context)
    const isFollowUpQuestion = messages.length > 2 && isLikelyFollowUp(lastUserMessage.text, language);
    const cacheKey = `${lastUserMessage.text}_${language}`;
    
    if (!isFollowUpQuestion && responseCache.has(cacheKey)) {
      console.log('📦 Using cached response');
      return { text: responseCache.get(cacheKey) || '' };
    }
    
    let response;
    
    // Use more conversation history for better context (last 5 messages instead of 3)
    const conversationHistory = messages.length > 2 
      ? messages.slice(-5)
      : messages;
    
    console.log(`💬 Conversation has ${messages.length} messages, using last ${conversationHistory.length} for context`);
    
    try {
      console.log('🤖 Calling Gemini API with conversation history...');
      response = await getGeminiResponse(conversationHistory, language);
      console.log('✅ Gemini API responded successfully');
    } catch (error) {
      console.warn("⚠️ Error with conversation history, trying with single message:", error.message);
      
      try {
        const enhancedPrompt = createAgriculturalPrompt(lastUserMessage.text, language);
        const singleMessage = {
          ...lastUserMessage,
          text: enhancedPrompt,
        };
        
        console.log('🔄 Retrying with single message...');
        response = await getGeminiResponse([singleMessage], language);
        console.log('✅ Retry successful');
      } catch (retryError) {
        console.error('❌ Both API attempts failed:', retryError.message);
        console.log('🔄 Using context-aware smart fallback...');
        // Generate intelligent fallback with conversation context
        response = generateContextAwareFallback(lastUserMessage.text, conversationHistory, language);
        console.log('✅ Fallback response generated');
      }
    }
    
    // Only cache if it's not a follow-up question
    if (!isFollowUpQuestion) {
      if (responseCache.size > 100) {
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
      }
      responseCache.set(cacheKey, response);
    }
    
    return { text: response };
  } catch (error) {
    console.error('Error getting chat response:', error);
    return {
      text: getFallbackResponse(language),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to detect if current question is a follow-up
const isLikelyFollowUp = (text, language) => {
  const lowerText = text.toLowerCase();
  
  const followUpIndicators = {
    en: [
      'tell me more', 'more details', 'more about', 'what about', 'how about',
      'also', 'and', 'that', 'it', 'this', 'these', 'those', 'them',
      'explain', 'elaborate', 'why', 'how does', 'can you',
      'what else', 'anything else', 'any other', 'other',
      'yes', 'ok', 'okay', 'sure', 'please', 'continue'
    ],
    hi: [
      'और बताओ', 'और जानकारी', 'इसके बारे में', 'उसके बारे में',
      'यह', 'वह', 'इसका', 'उसका', 'और', 'भी',
      'कैसे', 'क्यों', 'समझाओ', 'विस्तार से',
      'हाँ', 'ठीक है', 'अच्छा', 'जारी रखें', 'कृपया'
    ]
  };
  
  const indicators = [...(followUpIndicators[language] || []), ...followUpIndicators.en];
  
  // Check if message is short (likely a follow-up)
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount <= 5) {
    return indicators.some(ind => lowerText.includes(ind));
  }
  
  // Check if starts with follow-up words
  return indicators.some(ind => lowerText.startsWith(ind) || lowerText.includes(ind));
};

// Context-aware fallback that considers conversation history
const generateContextAwareFallback = (currentQuery, conversationHistory, language) => {
  console.log('🧠 Analyzing conversation context...');
  
  // Extract the topic from previous messages
  const recentMessages = conversationHistory.slice(-4);
  const conversationText = recentMessages.map(m => m.text).join(' ').toLowerCase();
  
  // Determine the main topic being discussed
  let topicContext = 'general';
  if (conversationText.includes('wheat') || conversationText.includes('गेहूं')) {
    topicContext = 'wheat';
  } else if (conversationText.includes('rice') || conversationText.includes('paddy') || conversationText.includes('चावल') || conversationText.includes('धान')) {
    topicContext = 'rice';
  } else if (conversationText.includes('pest') || conversationText.includes('disease') || conversationText.includes('कीट') || conversationText.includes('रोग')) {
    topicContext = 'pest';
  } else if (conversationText.includes('season') || conversationText.includes('crop') || conversationText.includes('मौसम') || conversationText.includes('फसल')) {
    topicContext = 'seasonal';
  } else if (conversationText.includes('price') || conversationText.includes('market') || conversationText.includes('mandi') || conversationText.includes('दाम') || conversationText.includes('मंडी')) {
    topicContext = 'market';
  }
  
  console.log(`📋 Detected topic context: ${topicContext}`);
  
  // If it's a follow-up, provide context-specific response
  if (isLikelyFollowUp(currentQuery, language)) {
    console.log('🔗 Detected follow-up question');
    return generateFollowUpResponse(topicContext, currentQuery, language);
  }
  
  // Otherwise, use the smart fallback
  return generateSmartFallback(currentQuery, language);
};

// Generate context-aware follow-up responses
const generateFollowUpResponse = (topicContext, currentQuery, language) => {
  const lowerQuery = currentQuery.toLowerCase();
  
  // WHEAT context follow-ups
  if (topicContext === 'wheat') {
    if (lowerQuery.includes('variety') || lowerQuery.includes('varieties') || lowerQuery.includes('type') || lowerQuery.includes('किस्म')) {
      return language === 'hi'
        ? `🌾 **गेहूं की प्रमुख किस्में:**\n\n**उत्तर भारत के लिए:**\n• HD-2967 - सिंचित क्षेत्र\n• PBW-343, PBW-725 - पंजाब के लिए\n• DBW-187, DBW-222 - देर से बुआई\n• WH-1105 - समय पर बुआई\n\n**मध्य भारत:**\n• GW-322, GW-366\n• HI-1544, HI-1563\n\n**सूखा प्रतिरोधी:**\n• Raj-4079, Raj-4238\n• C-306 (देसी, चपाती के लिए)\n\n**रोग प्रतिरोधी:**\n• HD-3086 (गेरुई रोध)\n• DBW-187 (कई रोगों से सुरक्षित)\n\n💡 अपने क्षेत्र के कृषि विभाग से स्थानीय सिफारिशें लें`
        : `🌾 **Wheat Varieties:**\n\n**North India:**\n• HD-2967 - Irrigated areas\n• PBW-343, PBW-725 - Punjab\n• DBW-187, DBW-222 - Late sowing\n• WH-1105 - Timely sowing\n\n**Central India:**\n• GW-322, GW-366\n• HI-1544, HI-1563\n\n**Drought Resistant:**\n• Raj-4079, Raj-4238\n• C-306 (Desi, for chapati)\n\n**Disease Resistant:**\n• HD-3086 (Rust resistant)\n• DBW-187 (Multiple disease tolerance)\n\n💡 Consult your local agriculture department`;
    }
    
    if (lowerQuery.includes('fertilizer') || lowerQuery.includes('उर्वरक') || lowerQuery.includes('खाद')) {
      return language === 'hi'
        ? `🌾 **गेहूं के लिए उर्वरक प्रबंधन:**\n\n**बुआई के समय:**\n• DAP: 100 किग्रा/एकड़\n• यूरिया: 40 किग्रा/एकड़\n• पोटाश (MOP): 25 किग्रा/एकड़\n• जिंक सल्फेट: 10 किग्रा/एकड़\n\n**पहली सिंचाई (CRI stage - 20-25 दिन):**\n• यूरिया: 50 किग्रा/एकड़\n\n**दूसरी सिंचाई (Tillering - 40-45 दिन):**\n• यूरिया: 40 किग्रा/एकड़\n\n**जैविक खाद:**\n• गोबर खाद: 5-6 टन/एकड़ (बुआई से 15 दिन पहले)\n• वर्मीकम्पोस्ट: 2 टन/एकड़\n\n**पर्णीय छिड़काव (Foliar spray):**\n• 19:19:19: 2% घोल (फूल आने पर)\n\n⚠️ मिट्टी परीक्षण के अनुसार समायोजित करें`
        : `🌾 **Wheat Fertilizer Management:**\n\n**At Sowing:**\n• DAP: 100 kg/acre\n• Urea: 40 kg/acre\n• Potash (MOP): 25 kg/acre\n• Zinc Sulfate: 10 kg/acre\n\n**First Irrigation (CRI stage - 20-25 days):**\n• Urea: 50 kg/acre\n\n**Second Irrigation (Tillering - 40-45 days):**\n• Urea: 40 kg/acre\n\n**Organic Manure:**\n• FYM: 5-6 tons/acre (15 days before sowing)\n• Vermicompost: 2 tons/acre\n\n**Foliar Spray:**\n• 19:19:19: 2% solution (at flowering)\n\n⚠️ Adjust based on soil test results`;
    }
    
    if (lowerQuery.includes('disease') || lowerQuery.includes('pest') || lowerQuery.includes('रोग') || lowerQuery.includes('कीट')) {
      return language === 'hi'
        ? `🌾 **गेहूं के प्रमुख रोग और कीट:**\n\n**1. गेरुई रोग (Rust):**\n• लक्षण: पत्तियों पर भूरे/काले धब्बे\n• उपचार: प्रोपिकोनाजोल या टेबुकोनाजोल स्प्रे\n• रोकथाम: प्रतिरोधी किस्में (HD-3086)\n\n**2. झुलसा रोग (Blight):**\n• लक्षण: पत्तियां सूखना\n• उपचार: मैंकोजेब स्प्रे\n\n**3. माहू (Aphids):**\n• लक्षण: छोटे हरे कीड़े, पत्तियां मुड़ना\n• उपचार: इमिडाक्लोप्रिड या डाइमेथोएट\n• जैविक: नीम का तेल 5ml/लीटर\n\n**4. दीमक (Termites):**\n• उपचार: क्लोरपाइरीफॉस बीज उपचार\n• मिट्टी में क्लोरपाइरीफॉस डस्ट\n\n**रोकथाम:**\n✓ स्वस्थ प्रमाणित बीज\n✓ उचित फसल चक्र\n✓ खेत की सफाई\n✓ नियमित निगरानी`
        : `🌾 **Wheat Diseases and Pests:**\n\n**1. Rust (Brown/Yellow/Black):**\n• Symptoms: Brown/black spots on leaves\n• Treatment: Propiconazole or Tebuconazole spray\n• Prevention: Resistant varieties (HD-3086)\n\n**2. Blight:**\n• Symptoms: Leaf drying\n• Treatment: Mancozeb spray\n\n**3. Aphids:**\n• Symptoms: Small green insects, curled leaves\n• Treatment: Imidacloprid or Dimethoate\n• Organic: Neem oil 5ml/liter\n\n**4. Termites:**\n• Treatment: Chlorpyrifos seed treatment\n• Soil application of Chlorpyrifos dust\n\n**Prevention:**\n✓ Certified healthy seeds\n✓ Crop rotation\n✓ Field sanitation\n✓ Regular monitoring`;
    }
  }
  
  // RICE context follow-ups
  if (topicContext === 'rice') {
    if (lowerQuery.includes('variety') || lowerQuery.includes('varieties') || lowerQuery.includes('किस्म')) {
      return language === 'hi'
        ? `🌾 **धान/चावल की किस्में:**\n\n**बासमती (सुगंधित):**\n• Pusa Basmati-1121 (लंबा दाना)\n• Pusa-1509 (जल्दी पकने वाली)\n• Basmati-370 (पारंपरिक)\n\n**गैर-बासमती (उच्च उपज):**\n• Swarna (MTU-7029) - 140 दिन\n• IR-64 - मध्यम दाना\n• Samba Mahsuri - बेहतर गुणवत्ता\n\n**संकर किस्में (Hybrid):**\n• Arize-6444 Gold\n• PHB-71 (Pioneer)\n• 27P31 (Kaveri)\n\n**विशेष परिस्थितियाँ:**\n• बाढ़ सहनशील: Swarna-Sub1\n• सूखा सहनशील: Sahbhagi Dhan\n• लवणीय मिट्टी: CSR-36, CSR-43\n\n💡 अपने क्षेत्र की जलवायु के अनुसार चुनें`
        : `🌾 **Rice/Paddy Varieties:**\n\n**Basmati (Aromatic):**\n• Pusa Basmati-1121 (Long grain)\n• Pusa-1509 (Early maturing)\n• Basmati-370 (Traditional)\n\n**Non-Basmati (High Yield):**\n• Swarna (MTU-7029) - 140 days\n• IR-64 - Medium grain\n• Samba Mahsuri - Better quality\n\n**Hybrid Varieties:**\n• Arize-6444 Gold\n• PHB-71 (Pioneer)\n• 27P31 (Kaveri)\n\n**Special Conditions:**\n• Flood tolerant: Swarna-Sub1\n• Drought tolerant: Sahbhagi Dhan\n• Saline soil: CSR-36, CSR-43\n\n💡 Choose based on your climate`;
    }
    
    if (lowerQuery.includes('transplant') || lowerQuery.includes('nursery') || lowerQuery.includes('रोपाई') || lowerQuery.includes('नर्सरी')) {
      return language === 'hi'
        ? `🌾 **धान की रोपाई और नर्सरी:**\n\n**नर्सरी तैयारी:**\n• क्षेत्र: 1 एकड़ के लिए 200 वर्ग मीटर\n• बीज दर: 8-10 किग्रा/एकड़\n• बीज उपचार: ट्राइकोडर्मा या कार्बेन्डाजिम\n• खाद: 40 किग्रा यूरिया + 20 किग्रा DAP\n\n**रोपाई विधि:**\n• पौध की उम्र: 25-30 दिन\n• पंक्ति की दूरी: 20 cm\n• पौधों की दूरी: 15 cm (20×15 cm)\n• प्रति स्थान पौधे: 2-3 पौधे\n• गहराई: 2-3 cm\n\n**SRI विधि (System of Rice Intensification):**\n• पौध की उम्र: 12-14 दिन\n• दूरी: 25×25 cm\n• प्रति स्थान: 1 पौधा\n• लाभ: 20-30% कम पानी, अधिक उपज\n\n**रोपाई के बाद:**\n✓ 2-3 cm पानी बनाए रखें\n✓ 10 दिन बाद पहली निराई`
        : `🌾 **Rice Transplanting and Nursery:**\n\n**Nursery Preparation:**\n• Area: 200 sq.m for 1 acre\n• Seed rate: 8-10 kg/acre\n• Seed treatment: Trichoderma or Carbendazim\n• Fertilizer: 40 kg Urea + 20 kg DAP\n\n**Transplanting Method:**\n• Seedling age: 25-30 days\n• Row spacing: 20 cm\n• Plant spacing: 15 cm (20×15 cm)\n• Plants per hill: 2-3 seedlings\n• Depth: 2-3 cm\n\n**SRI Method (System of Rice Intensification):**\n• Seedling age: 12-14 days\n• Spacing: 25×25 cm\n• Per hill: 1 seedling\n• Benefits: 20-30% less water, higher yield\n\n**After Transplanting:**\n✓ Maintain 2-3 cm water\n✓ First weeding after 10 days`;
    }
  }
  
  // SEASONAL crops context follow-ups
  if (topicContext === 'seasonal') {
    if (lowerQuery.includes('my region') || lowerQuery.includes('my area') || lowerQuery.includes('मेरे क्षेत्र') || lowerQuery.includes('मेरे इलाके')) {
      return language === 'hi'
        ? `🌾 **क्षेत्रवार फसल सिफारिशें:**\n\n**उत्तर भारत (Punjab, Haryana, UP):**\n• रबी: गेहूं, सरसों, चना\n• खरीफ: धान, बासमती, गन्ना\n\n**मध्य भारत (MP, Rajasthan):**\n• रबी: गेहूं, चना, सरसों, जौ\n• खरीफ: सोयाबीन, मक्का, कपास\n\n**दक्षिण भारत (TN, AP, Karnataka):**\n• रबी: ज्वार, रागी, दालें\n• खरीफ: धान, मक्का, मूंगफली\n\n**पूर्वी भारत (Bihar, WB, Odisha):**\n• रबी: गेहूं, मसूर, आलू\n• खरीफ: धान (मुख्य), जूट\n\n**पश्चिमी भारत (Gujarat, Maharashtra):**\n• रबी: गेहूं, चना, प्याज\n• खरीफ: कपास, सोयाबीन, मूंगफली\n\n💡 अपना राज्य/जिला बताएं और मैं विशिष्ट सलाह दूंगा`
        : `🌾 **Region-wise Crop Recommendations:**\n\n**North India (Punjab, Haryana, UP):**\n• Rabi: Wheat, Mustard, Chickpea\n• Kharif: Paddy, Basmati, Sugarcane\n\n**Central India (MP, Rajasthan):**\n• Rabi: Wheat, Chickpea, Mustard, Barley\n• Kharif: Soybean, Maize, Cotton\n\n**South India (TN, AP, Karnataka):**\n• Rabi: Jowar, Ragi, Pulses\n• Kharif: Rice, Maize, Groundnut\n\n**East India (Bihar, WB, Odisha):**\n• Rabi: Wheat, Lentil, Potato\n• Kharif: Rice (main), Jute\n\n**West India (Gujarat, Maharashtra):**\n• Rabi: Wheat, Chickpea, Onion\n• Kharif: Cotton, Soybean, Groundnut\n\n💡 Tell me your state/district for specific advice`;
    }
  }
  
  // MARKET context follow-ups
  if (topicContext === 'market') {
    if (lowerQuery.includes('how') || lowerQuery.includes('where') || lowerQuery.includes('कैसे') || lowerQuery.includes('कहाँ')) {
      return language === 'hi'
        ? `💰 **फसल बेचने के तरीके:**\n\n**1. ई-नाम (e-NAM):**\n• ऑनलाइन पंजीकरण: enam.gov.in\n• 1000+ मंडियों से जुड़े\n• पारदर्शी मूल्य\n• सीधा भुगतान\n\n**2. सरकारी खरीद (MSP):**\n• FCI/राज्य एजेंसियां\n• न्यूनतम समर्थन मूल्य की गारंटी\n• किसान पंजीकरण जरूरी\n\n**3. स्थानीय मंडी:**\n• नजदीकी APMC मंडी\n• आढ़ती के माध्यम से\n• तुरंत नकद\n\n**4. FPO/सहकारी समितियां:**\n• सामूहिक विपणन\n• बेहतर मोलभाव\n• कम बिचौलिए\n\n**5. सीधी खरीद:**\n• कंपनियों से अनुबंध\n• BigHaat, DeHaat जैसे प्लेटफॉर्म\n• पूर्व निर्धारित मूल्य\n\n**जरूरी दस्तावेज:**\n✓ आधार कार्ड\n✓ जमीन के कागजात\n✓ बैंक खाता\n✓ मोबाइल नंबर`
        : `💰 **Ways to Sell Your Crops:**\n\n**1. e-NAM (National Agriculture Market):**\n• Online registration: enam.gov.in\n• Connected to 1000+ mandis\n• Transparent pricing\n• Direct payment\n\n**2. Government Procurement (MSP):**\n• FCI/State agencies\n• Guaranteed MSP\n• Farmer registration required\n\n**3. Local Mandi:**\n• Nearby APMC mandi\n• Through commission agents\n• Immediate cash\n\n**4. FPO/Cooperatives:**\n• Collective marketing\n• Better bargaining\n• Fewer middlemen\n\n**5. Direct Purchase:**\n• Contract with companies\n• Platforms like BigHaat, DeHaat\n• Pre-determined price\n\n**Required Documents:**\n✓ Aadhaar Card\n✓ Land documents\n✓ Bank account\n✓ Mobile number`;
    }
  }
  
  // Generic follow-up responses
  if (lowerQuery.includes('yes') || lowerQuery.includes('sure') || lowerQuery.includes('okay') || lowerQuery.includes('ok') ||
      lowerQuery.includes('हाँ') || lowerQuery.includes('ठीक') || lowerQuery.includes('अच्छा')) {
    return language === 'hi'
      ? `बढ़िया! 👍 मुझे बताएं कि आप किस बारे में और जानना चाहते हैं:\n\n• किस्में (varieties)\n• उर्वरक (fertilizers)\n• सिंचाई (irrigation)\n• रोग और कीट (diseases & pests)\n• बाजार (market)\n• योजनाएं (schemes)\n• कोई और प्रश्न\n\nआप अपने क्षेत्र या विशिष्ट समस्या के बारे में भी पूछ सकते हैं।`
      : `Great! 👍 Tell me what you'd like to know more about:\n\n• Varieties\n• Fertilizers\n• Irrigation\n• Diseases & Pests\n• Market prices\n• Government schemes\n• Any other question\n\nYou can also ask about your specific region or problem.`;
  }
  
  // If no specific follow-up detected, prompt for more context
  return language === 'hi'
    ? `मैं समझ गया कि आप ${topicContext === 'wheat' ? 'गेहूं' : topicContext === 'rice' ? 'धान' : 'फसलों'} के बारे में पूछ रहे हैं। कृपया अपना प्रश्न विस्तार से पूछें। आप पूछ सकते हैं:\n\n• किस्में\n• खेती का तरीका\n• उर्वरक\n• सिंचाई\n• रोग/कीट\n• बाजार भाव\n\nया कोई विशिष्ट समस्या बताएं।`
    : `I understand you're asking about ${topicContext}. Please ask your specific question. You can ask about:\n\n• Varieties\n• Cultivation method\n• Fertilizers\n• Irrigation\n• Diseases/Pests\n• Market prices\n\nOr share any specific problem.`;
};

const generateSmartFallback = (query, language) => {
  const lowerQuery = query.toLowerCase();
  
  // Detect query type and provide intelligent fallback
  
  // SEASONAL CROPS - Check for season-related queries FIRST (most common)
  if (lowerQuery.includes('season') || lowerQuery.includes('suitable') || lowerQuery.includes('crop') || 
      lowerQuery.includes('मौसम') || lowerQuery.includes('फसल') || lowerQuery.includes('उपयुक्त') ||
      lowerQuery.includes('winter') || lowerQuery.includes('summer') || lowerQuery.includes('monsoon') ||
      lowerQuery.includes('rabi') || lowerQuery.includes('kharif') || lowerQuery.includes('zaid')) {
    return language === 'hi'
      ? `🌾 **मौसम के अनुसार फसलें**\n\n**रबी मौसम (अक्टूबर-मार्च):**\n✅ गेहूं - मुख्य फसल\n✅ चना - दलहनी फसल\n✅ सरसों - तिलहन फसल\n✅ जौ - कम पानी चाहिए\n✅ मटर - सब्जी फसल\n✅ आलू - नकदी फसल\n\n**खरीफ मौसम (जून-सितंबर):**\n✅ धान/चावल - मुख्य फसल\n✅ मक्का - अनाज फसल\n✅ कपास - नकदी फसल\n✅ सोयाबीन - तिलहन\n✅ बाजरा - मोटा अनाज\n\n**जायद मौसम (मार्च-जून):**\n✅ तरबूज - फल\n✅ खरबूजा - फल\n✅ खीरा - सब्जी\n✅ मूंग - दलहन\n\n📞 विशेष सलाह: 1800-180-1551\n💡 अपने क्षेत्र की मिट्टी और जलवायु के अनुसार चुनें`
      : `🌾 **Seasonal Crop Recommendations**\n\n**RABI Season (October-March) - Winter Crops:**\n✅ **Wheat** - Main crop, good for north India\n✅ **Chickpea** (Chana) - Pulse crop, nitrogen fixer\n✅ **Mustard** - Oilseed, good cash crop\n✅ **Barley** - Low water requirement\n✅ **Peas** - Vegetable crop\n✅ **Potato** - Cash crop, high demand\n\n**KHARIF Season (June-September) - Monsoon Crops:**\n✅ **Rice/Paddy** - Main crop, needs water\n✅ **Maize/Corn** - Cereal crop\n✅ **Cotton** - Cash crop, textile industry\n✅ **Soybean** - Oilseed crop\n✅ **Bajra** (Pearl Millet) - Coarse cereal\n✅ **Sugarcane** - Perennial cash crop\n\n**ZAID Season (March-June) - Summer Crops:**\n✅ **Watermelon** - Fruit crop\n✅ **Muskmelon** - Fruit crop\n✅ **Cucumber** - Vegetable\n✅ **Moong** (Green Gram) - Pulse\n\n**💡 Selection Factors:**\n• Soil type (Sandy, Loamy, Clay)\n• Water availability\n• Climate of your region\n• Market demand\n• Your experience level\n\n**📞 Expert Guidance:** 1800-180-1551 (Kisan Call Center)\n**🌐 Market Prices:** enam.gov.in\n\nWould you like specific advice for your region?`;
  }
  
  // WHEAT specific queries
  if (lowerQuery.includes('wheat') || lowerQuery.includes('गेहूं')) {
    return language === 'hi' 
      ? `🌾 **गेहूं की खेती के बारे में**\n\n• **बुआई का समय**: अक्टूबर-नवंबर (रबी)\n• **मिट्टी**: दोमट मिट्टी सबसे अच्छी\n• **किस्में**: HD-2967, PBW-343, DBW-187\n• **बीज दर**: 100 किग्रा/हेक्टेयर\n• **सिंचाई**: 4-6 बार (CRI, late tillering, flowering)\n• **उर्वरक**: NPK 120:60:40 किग्रा/हेक्टेयर\n• **कटाई**: मार्च-अप्रैल (110-120 दिन)\n\n💰 **MSP**: ₹2125 प्रति क्विंटल\n📊 **उपज**: 40-50 क्विंटल/हेक्टेयर\n\n⚠️ **सावधानियां**: गेरुई रोग, माहू से बचाव करें`
      : `🌾 **Wheat Farming Guide**\n\n• **Sowing Time**: October-November (Rabi season)\n• **Soil**: Loamy soil is best, pH 6.0-7.5\n• **Varieties**: HD-2967, PBW-343, DBW-187\n• **Seed Rate**: 100 kg/hectare\n• **Irrigation**: 4-6 times (CRI, late tillering, flowering)\n• **Fertilizer**: NPK 120:60:40 kg/hectare\n• **Harvesting**: March-April (110-120 days)\n\n💰 **MSP**: ₹2125 per quintal\n📊 **Yield**: 40-50 quintal/hectare\n\n⚠️ **Watch Out**: Rust disease, aphid control`;
  }
  
  // RICE specific queries
  if (lowerQuery.includes('rice') || lowerQuery.includes('paddy') || lowerQuery.includes('चावल') || lowerQuery.includes('धान')) {
    return language === 'hi'
      ? `🌾 **चावल/धान की खेती**\n\n• **बुआई**: जून-जुलाई (खरीफ मौसम)\n• **पानी**: बहुत अधिक पानी चाहिए\n• **किस्में**: बासमती-370, IR-64, स्वर्णा, पूसा-1121\n• **नर्सरी**: 25-30 दिन की पौध\n• **रोपाई**: 15×20 सेमी की दूरी\n• **उर्वरक**: NPK 120:60:40 + जिंक\n• **कटाई**: सितंबर-अक्टूबर (120-140 दिन)\n\n💰 **MSP**: ₹2183 प्रति क्विंटल\n📊 **उपज**: 50-60 क्विंटल/हेक्टेयर\n\n🌱 SRI विधि अपनाएं - कम पानी, अधिक उपज`
      : `🌾 **Rice/Paddy Cultivation**\n\n• **Sowing**: June-July (Kharif season)\n• **Water**: Needs plenty of water (flooded fields)\n• **Varieties**: Basmati-370, IR-64, Swarna, Pusa-1121\n• **Nursery**: 25-30 days old seedlings\n• **Transplanting**: 15×20 cm spacing\n• **Fertilizer**: NPK 120:60:40 + Zinc\n• **Harvesting**: September-October (120-140 days)\n\n💰 **MSP**: ₹2183 per quintal\n📊 **Yield**: 50-60 quintal/hectare\n\n🌱 Try SRI method - Less water, more yield`;
  }
  
  // PEST & DISEASE queries
  if (lowerQuery.includes('pest') || lowerQuery.includes('disease') || lowerQuery.includes('insect') || lowerQuery.includes('bug') ||
      lowerQuery.includes('कीट') || lowerQuery.includes('रोग') || lowerQuery.includes('बीमारी')) {
    return language === 'hi'
      ? `🐛 **कीट और रोग नियंत्रण**\n\n**प्राकृतिक उपाय:**\n• **नीम का तेल**: 5 मिली/लीटर पानी में\n• **गोमूत्र**: 10% घोल छिड़काव\n• **लहसुन-मिर्च**: कीटनाशक घोल\n• **बर्डोमिश्रण**: फफूंद रोकथाम\n\n**रासायनिक उपचार:**\n• क्लोरपाइरीफॉस 20 EC (दीमक के लिए)\n• इमिडाक्लोप्रिड (चूसक कीटों के लिए)\n• मैंकोजेब (फफूंद रोगों के लिए)\n\n**रोकथाम:**\n✓ फसल चक्र अपनाएं\n✓ खेत की सफाई रखें\n✓ स्वस्थ बीज का प्रयोग\n✓ उचित जल निकास\n✓ नियमित निगरानी\n\n⚠️ रासायनिक दवाएं सावधानी से प्रयोग करें\n📞 मदद: 1800-180-1551`
      : `🐛 **Pest and Disease Control**\n\n**Natural Methods:**\n• **Neem Oil**: 5ml per liter water spray\n• **Cow Urine**: 10% solution spray\n• **Garlic-Chili**: Natural pesticide mix\n• **Bordeaux Mixture**: Fungal disease prevention\n\n**Chemical Treatment:**\n• Chlorpyrifos 20 EC (for termites)\n• Imidacloprid (for sucking pests)\n• Mancozeb (for fungal diseases)\n\n**Prevention Best Practices:**\n✓ Practice crop rotation\n✓ Keep field clean and weed-free\n✓ Use certified healthy seeds\n✓ Ensure proper drainage\n✓ Regular monitoring and scouting\n✓ Use pheromone traps\n\n⚠️ Always wear protective gear with chemicals\n⏰ Spray early morning or evening\n📞 Help: 1800-180-1551 (Kisan Call Center)`;
  }
  
  // MARKET PRICE queries
  if (lowerQuery.includes('price') || lowerQuery.includes('market') || lowerQuery.includes('mandi') || lowerQuery.includes('sell') ||
      lowerQuery.includes('दाम') || lowerQuery.includes('मंडी') || lowerQuery.includes('भाव') || lowerQuery.includes('बेचना')) {
    return language === 'hi'
      ? `💰 **बाजार और मंडी की जानकारी**\n\n**ऑनलाइन प्लेटफॉर्म:**\n• **ई-नाम पोर्टल**: enam.gov.in - ऑनलाइन मंडी भाव\n• **AgMarkNet**: agmarknet.gov.in - दैनिक भाव\n• **मेरी फसल मेरा ब्योरा**: fasal.haryana.gov.in\n\n**MSP (न्यूनतम समर्थन मूल्य) 2024:**\n• गेहूं: ₹2125/क्विंटल\n• धान (सामान्य): ₹2183/क्विंटल\n• मक्का: ₹2090/क्विंटल\n• कपास: ₹7020/क्विंटल\n\n**बेचने के टिप्स:**\n✓ सही समय पर बेचें\n✓ गुणवत्ता बनाए रखें\n✓ मंडी भाव की तुलना करें\n✓ सीधी खरीद का लाभ लें\n✓ FPO/समूह के साथ जुड़ें\n\n📱 किसान कॉल सेंटर: 1800-180-1551\n🌐 PM Kisan: pmkisan.gov.in`
      : `💰 **Market and Mandi Information**\n\n**Online Platforms:**\n• **e-NAM Portal**: enam.gov.in - Online market prices\n• **AgMarkNet**: agmarknet.gov.in - Daily prices\n• **Kisan Rath**: kisanrath.nic.in - Transport\n\n**MSP (Minimum Support Price) 2024:**\n• Wheat: ₹2125/quintal\n• Paddy (Common): ₹2183/quintal\n• Maize: ₹2090/quintal\n• Cotton: ₹7020/quintal\n\n**Selling Tips:**\n✓ Choose right time to sell\n✓ Maintain crop quality\n✓ Compare mandi rates\n✓ Use direct procurement\n✓ Join FPO/farmer groups\n✓ Proper storage reduces losses\n\n📱 Kisan Call Center: 1800-180-1551\n🌐 Market Info: agmarknet.gov.in`;
  }
  
  // GOVERNMENT SCHEMES queries
  if (lowerQuery.includes('subsidy') || lowerQuery.includes('scheme') || lowerQuery.includes('loan') || lowerQuery.includes('insurance') ||
      lowerQuery.includes('सब्सिडी') || lowerQuery.includes('योजना') || lowerQuery.includes('लोन') || lowerQuery.includes('बीमा')) {
    return language === 'hi'
      ? `🏛️ **सरकारी योजनाएं और सब्सिडी**\n\n**1. PM-किसान सम्मान निधि**\n• ₹6000 प्रति वर्ष (3 किस्त)\n• सभी भूमिधारक किसान\n• 🌐 pmkisan.gov.in\n\n**2. किसान क्रेडिट कार्ड (KCC)**\n• 3 लाख तक ऋण\n• 4% ब्याज (समय पर चुकौती पर)\n• नजदीकी बैंक से संपर्क करें\n\n**3. प्रधानमंत्री फसल बीमा योजना**\n• खरीफ: 2% प्रीमियम\n• रबी: 1.5% प्रीमियम\n• 🌐 pmfby.gov.in\n\n**4. उपकरण सब्सिडी**\n• ट्रैक्टर: 25-50% सब्सिडी\n• पंप सेट: 50% तक\n• राज्य कृषि विभाग से संपर्क\n\n**5. मृदा स्वास्थ्य कार्ड**\n• मुफ्त मिट्टी जांच\n• 🌐 soilhealth.dac.gov.in\n\n📞 हेल्पलाइन: 155261\n🌐 किसान पोर्टल: farmer.gov.in`
      : `🏛️ **Government Schemes and Subsidies**\n\n**1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**\n• ₹6000 per year (3 installments)\n• All landholding farmers eligible\n• Direct bank transfer\n• 🌐 Register: pmkisan.gov.in\n\n**2. Kisan Credit Card (KCC)**\n• Loan up to ₹3 lakh\n• 4% interest (on timely repayment)\n• Apply at nearest bank\n\n**3. PM Fasal Bima Yojana (Crop Insurance)**\n• Kharif: 2% premium\n• Rabi: 1.5% premium\n• Coverage against all risks\n• 🌐 pmfby.gov.in\n\n**4. Equipment Subsidy**\n• Tractor: 25-50% subsidy\n• Pump Sets: Up to 50%\n• Drip/Sprinkler: 55-80%\n• Contact State Agriculture Dept\n\n**5. Soil Health Card**\n• Free soil testing\n• 🌐 soilhealth.dac.gov.in\n\n**6. Other Schemes:**\n• Paramparagat Krishi Vikas Yojana (Organic)\n• Rashtriya Krishi Vikas Yojana\n• National Horticulture Mission\n\n📞 Helpline: 155261 / 1800-180-1551\n🌐 Portal: farmer.gov.in`;
  }
  
  // IRRIGATION queries
  if (lowerQuery.includes('irrigation') || lowerQuery.includes('water') || lowerQuery.includes('drip') || lowerQuery.includes('sprinkler') ||
      lowerQuery.includes('सिंचाई') || lowerQuery.includes('पानी')) {
    return language === 'hi'
      ? `💧 **सिंचाई और जल प्रबंधन**\n\n**सिंचाई के तरीके:**\n• **ड्रिप सिंचाई**: 40-60% पानी की बचत\n• **स्प्रिंकलर**: समान वितरण\n• **फव्वारा**: सब्जियों के लिए अच्छा\n• **रिज फरो**: कतारों में\n\n**जल प्रबंधन टिप्स:**\n✓ सुबह या शाम को सिंचाई करें\n✓ मल्चिंग का प्रयोग\n✓ वर्षा जल संचयन\n✓ समय पर सिंचाई\n✓ मिट्टी की नमी जांचें\n\n**सब्सिडी:**\n• ड्रिप/स्प्रिंकलर: 55-80%\n• PMKSY योजना के तहत\n\n📞 जानकारी: 1800-180-1551`
      : `💧 **Irrigation and Water Management**\n\n**Irrigation Methods:**\n• **Drip Irrigation**: 40-60% water saving\n• **Sprinkler**: Uniform distribution\n• **Micro-sprinkler**: For vegetables\n• **Ridge and Furrow**: For row crops\n\n**Water Management Tips:**\n✓ Irrigate morning or evening\n✓ Use mulching\n✓ Rainwater harvesting\n✓ Timely irrigation\n✓ Check soil moisture\n✓ Avoid over-watering\n\n**Subsidy Available:**\n• Drip/Sprinkler: 55-80%\n• Under PMKSY scheme\n• Contact agriculture dept\n\n📞 Info: 1800-180-1551`;
  }
  
  // Default fallback for general questions
  return language === 'hi'
    ? `नमस्ते किसान भाई! 🙏\n\nमैं आपकी खेती में मदद के लिए यहां हूं। आप मुझसे पूछ सकते हैं:\n\n🌾 **फसलों के बारे में**: कौन सी फसल, कैसे उगाएं\n💧 **सिंचाई**: पानी प्रबंधन, ड्रिप, स्प्रिंकलर\n🐛 **कीट नियंत्रण**: रोग, कीटनाशक, जैविक उपचार\n💰 **बाजार भाव**: MSP, मंडी दाम, बेचने के टिप्स\n🏛️ **सरकारी योजनाएं**: PM किसान, KCC, बीमा, सब्सिडी\n🚜 **आधुनिक खेती**: मशीनरी, तकनीक\n\n📞 **सीधी मदद**: 1800-180-1551 (किसान कॉल सेंटर)\n\nकृपया अपना प्रश्न विस्तार से पूछें।`
    : `Hello Farmer Friend! 🙏\n\nI'm here to help you with farming. You can ask me about:\n\n🌾 **Crop Cultivation**: Which crops, how to grow\n💧 **Irrigation**: Water management, drip, sprinkler\n🐛 **Pest Control**: Diseases, pesticides, organic methods\n💰 **Market Prices**: MSP, mandi rates, selling tips\n🏛️ **Government Schemes**: PM Kisan, KCC, insurance, subsidies\n🚜 **Modern Farming**: Machinery, technology\n\n📞 **Direct Help**: 1800-180-1551 (Kisan Call Center)\n\nPlease ask your question in detail.`;
};

export const getFallbackResponse = (language) => {
  const fallbackResponses = {
    'en': "I'm having trouble connecting right now, but I'm here to help with your farming questions! 🌾\n\nYou can ask me about:\n• Crop cultivation and best practices\n• Pest and disease management\n• Irrigation and soil health\n• Market prices and schemes\n• Weather and seasonal advice\n\nPlease try asking your question again, or contact the Kisan Call Center at 1800-180-1551 for immediate assistance.",
    'hi': "मुझे अभी कनेक्ट करने में परेशानी हो रही है, लेकिन मैं आपके खेती के सवालों में मदद के लिए यहां हूं! 🌾\n\nआप मुझसे पूछ सकते हैं:\n• फसलों की खेती और तरीके\n• कीट और रोग प्रबंधन\n• सिंचाई और मृदा स्वास्थ्य\n• बाजार भाव और योजनाएं\n• मौसम और मौसमी सलाह\n\nकृपया अपना प्रश्न दोबारा पूछें, या तत्काल सहायता के लिए किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।",
    'bn': "আমার এখন সংযোগ করতে সমস্যা হচ্ছে, কিন্তু আমি আপনার কৃষি প্রশ্নে সাহায্য করতে এখানে আছি! 🌾\n\nআপনি আমাকে জিজ্ঞাসা করতে পারেন:\n• ফসল চাষ এবং সেরা পদ্ধতি\n• কীটপতঙ্গ এবং রোগ ব্যবস্থাপনা\n• সেচ এবং মাটির স্বাস্থ্য\n• বাজার মূল্য এবং প্রকল্প\n• আবহাওয়া এবং মৌসুমী পরামর্শ\n\nঅনুগ্রহ করে আবার আপনার প্রশ্ন করুন, বা তাৎক্ষণিক সহায়তার জন্য কিষান কল সেন্টার 1800-180-1551 এ যোগাযোগ করুন।",
    'te': "నాకు ఇప్పుడు కనెక్ట్ చేయడంలో ఇబ్బంది ఉంది, కానీ మీ వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను! 🌾\n\nమీరు నన్ను అడగవచ్చు:\n• పంట సాగు మరియు ఉత్తమ పద్ధతులు\n• చీడపురుగులు మరియు వ్యాధి నిర్వహణ\n• నీటిపారుదల మరియు నేల ఆరోగ్యం\n• మార్కెట్ ధరలు మరియు పథకాలు\n• వాతావరణం మరియు కాలానుగుణ సలహా\n\nదయచేసి మీ ప్రశ్నను మళ్లీ అడగండి, లేదా తక్షణ సహాయం కోసం కిసాన్ కాల్ సెంటర్ 1800-180-1551కి సంప్రదించండి।",
    'mr': "मला आता कनेक्ट करण्यात अडचण येत आहे, पण मी तुमच्या शेती प्रश्नांसाठी मदत करण्यासाठी येथे आहे! 🌾\n\nतुम्ही मला विचारू शकता:\n• पीक लागवड आणि सर्वोत्तम पद्धती\n• कीड आणि रोग व्यवस्थापन\n• सिंचन आणि माती आरोग्य\n• बाजार भाव आणि योजना\n• हवामान आणि हंगामी सल्ला\n\nकृपया तुमचा प्रश्न पुन्हा विचारा, किंवा तत्काळ मदतीसाठी किसान कॉल सेंटर 1800-180-1551 वर संपर्क करा।",
    'ta': "எனக்கு இப்போது இணைப்பதில் சிக்கல் உள்ளது, ஆனால் உங்கள் விவசாய கேள்விகளுக்கு உதவ நான் இங்கு இருக்கிறேன்! 🌾\n\nநீங்கள் என்னிடம் கேட்கலாம்:\n• பயிர் சாகுபடி மற்றும் சிறந்த நடைமுறைகள்\n• பூச்சி மற்றும் நோய் மேலாண்மை\n• நீர்ப்பாசனம் மற்றும் மண் ஆரோக்கியம்\n• சந்தை விலைகள் மற்றும் திட்டங்கள்\n• வானிலை மற்றும் பருவகால ஆலோசனை\n\nதயவுசெய்து உங்கள் கேள்வியை மீண்டும் கேளுங்கள், அல்லது உடனடி உதவிக்கு கிசான் கால் சென்டர் 1800-180-1551ஐ தொடர்பு கொள்ளுங்கள்।",
    'ur': "مجھے ابھی کنیکٹ کرنے میں پریشانی ہو رہی ہے، لیکن میں آپ کے کھیتی باڑی کے سوالات میں مدد کے لیے یہاں ہوں! 🌾\n\nآپ مجھ سے پوچھ سکتے ہیں:\n• فصلوں کی کاشت اور بہترین طریقے\n• کیڑے اور بیماری کا انتظام\n• آبپاشی اور مٹی کی صحت\n• بازار کی قیمتیں اور اسکیمیں\n• موسم اور موسمی مشورہ\n\nبراہ کرم اپنا سوال دوبارہ پوچھیں، یا فوری مدد کے لیے کسان کال سینٹر 1800-180-1551 سے رابطہ کریں۔",
    'gu': "મને અત્યારે કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે, પરંતુ હું તમારા ખેતીના પ્રશ્નોમાં મદદ માટે અહીં છું! 🌾\n\nતમે મને પૂછી શકો છો:\n• પાક ખેતી અને શ્રેષ્ઠ પદ્ધતિઓ\n• જંતુ અને રોગ વ્યવસ્થાપન\n• સિંચાઈ અને માટી સ્વાસ્થ્ય\n• બજાર ભાવ અને યોજનાઓ\n• હવામાન અને મોસમી સલાહ\n\nકૃપા કરીને તમારો પ્રશ્ન ફરીથી પૂછો, અથવા તાત્કાલિક સહાય માટે કિસાન કોલ સેન્ટર 1800-180-1551 પર સંપર્ક કરો।",
    'kn': "ನನಗೆ ಇದೀಗ ಸಂಪರ್ಕಿಸಲು ತೊಂದರೆಯಾಗುತ್ತಿದೆ, ಆದರೆ ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ! 🌾\n\nನೀವು ನನ್ನನ್ನು ಕೇಳಬಹುದು:\n• ಬೆಳೆ ಕೃಷಿ ಮತ್ತು ಉತ್ತಮ ವಿಧಾನಗಳು\n• ಕೀಟ ಮತ್ತು ರೋಗ ನಿರ್ವಹಣೆ\n• ನೀರಾವರಿ ಮತ್ತು ಮಣ್ಣು ಆರೋಗ್ಯ\n• ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಯೋಜನೆಗಳು\n• ಹವಾಮಾನ ಮತ್ತು ಋತುಮಾನದ ಸಲಹೆ\n\nದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕೇಳಿ, ಅಥವಾ ತ್ವರಿತ ಸಹಾಯಕ್ಕಾಗಿ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ।",
    'ml': "എനിക്ക് ഇപ്പോൾ കണക്റ്റ് ചെയ്യുന്നതിൽ പ്രശ്‌നമുണ്ട്, പക്ഷേ നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്! 🌾\n\nനിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം:\n• വിള കൃഷിയും മികച്ച രീതികളും\n• കീടനാശിനി, രോഗ നിയന്ത്രണം\n• ജലസേചനവും മണ്ണിന്റെ ആരോഗ്യവും\n• വിപണി വിലകളും പദ്ധതികളും\n• കാലാവസ്ഥയും സീസണൽ ഉപദേശവും\n\nദയവായി നിങ്ങളുടെ ചോദ്യം വീണ്ടും ചോദിക്കുക, അല്ലെങ്കിൽ ഉടനടി സഹായത്തിനായി കിസാൻ കോൾ സെന്റർ 1800-180-1551 ബന്ധപ്പെടുക।",
    'pa': "ਮੈਨੂੰ ਹੁਣ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ, ਪਰ ਮੈਂ ਤੁਹਾਡੇ ਖੇਤੀਬਾੜੀ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ! 🌾\n\nਤੁਸੀਂ ਮੈਨੂੰ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n• ਫਸਲ ਕਾਸ਼ਤ ਅਤੇ ਵਧੀਆ ਢੰਗ\n• ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀ ਪ੍ਰਬੰਧਨ\n• ਸਿੰਚਾਈ ਅਤੇ ਮਿੱਟੀ ਸਿਹਤ\n• ਮਾਰਕੀਟ ਭਾਅ ਅਤੇ ਯੋਜਨਾਵਾਂ\n• ਮੌਸਮ ਅਤੇ ਮੌਸਮੀ ਸਲਾਹ\n\nਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਦੁਬਾਰਾ ਪੁੱਛੋ, ਜਾਂ ਤੁਰੰਤ ਮਦਦ ਲਈ ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ 1800-180-1551 'ਤੇ ਸੰਪਰਕ ਕਰੋ।",
    'or': "ମୋତେ ବର୍ତ୍ତମାନ ସଂଯୋଗ କରିବାରେ ସମସ୍ୟା ହେଉଛି, କିନ୍ତୁ ମୁଁ ଆପଣଙ୍କର କୃଷି ପ୍ରଶ୍ନରେ ସାହାଯ୍ୟ କରିବାକୁ ଏଠାରେ ଅଛି! 🌾\n\nଆପଣ ମୋତେ ପଚାରିପାରିବେ:\n• ଫସଲ ଚାଷ ଏବଂ ସର୍ବୋତ୍ତମ ଅଭ୍ୟାସ\n• କୀଟପତଙ୍ଗ ଏବଂ ରୋଗ ପରିଚାଳନା\n• ଜଳସେଚନ ଏବଂ ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ\n• ବଜାର ମୂଲ୍ୟ ଏବଂ ଯୋଜନା\n• ପାଣିପାଗ ଏବଂ ଋତୁସନ୍ଧ୍ୟା ପରାମର୍ଶ\n\nଦୟାକରି ଆପଣଙ୍କର ପ୍ରଶ୍ନ ପୁନର୍ବାର ପଚାରନ୍ତୁ, କିମ୍ବା ତୁରନ୍ତ ସାହାଯ୍ୟ ପାଇଁ କିସାନ କଲ୍ ସେଣ୍ଟର 1800-180-1551 ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
    'as': "মোক এতিয়া সংযোগ কৰাত সমস্যা হৈছে, কিন্তু মই আপোনাৰ কৃষি প্ৰশ্নত সহায় কৰিবলৈ ইয়াত আছো! 🌾\n\nআপুনি মোক সুধিব পাৰে:\n• শস্য খেতি আৰু শ্ৰেষ্ঠ পদ্ধতি\n• কীট-পতঙ্গ আৰু ৰোগ ব্যৱস্থাপনা\n• জলসিঞ্চন আৰু মাটিৰ স্বাস্থ্য\n• বজাৰ মূল্য আৰু আঁচনি\n• বতৰ আৰু ঋতুভিত্তিক পৰামৰ্শ\n\nঅনুগ্ৰহ কৰি আপোনাৰ প্ৰশ্ন পুনৰ সোধক, বা তৎক্ষণাৎ সহায়ৰ বাবে কিচান কল চেণ্টাৰ 1800-180-1551 ত যোগাযোগ কৰক।"
  };
  
  return fallbackResponses[language] || fallbackResponses['en'];
};