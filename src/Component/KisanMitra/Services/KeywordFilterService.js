// Agricultural keyword filtering service
export const isAgriculturalQuery = (message, language = 'en') => {
  const lowercaseMessage = message.toLowerCase();
  
  // Define greeting and basic conversational keywords that should be allowed
  const greetingKeywords = {
    en: [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'good night',
      'namaste', 'namaskar', 'how are you', 'what is your name', 'who are you',
      'thank you', 'thanks', 'bye', 'goodbye', 'see you', 'nice to meet you',
      'help', 'can you help', 'i need help', 'what can you do', 'how can you help',
      'kisan mitra', 'kisanmitra', 'mitra', 'assistant', 'chatbot', 'bot'
    ],
    hi: [
      'हाय', 'हैलो', 'नमस्ते', 'नमस्कार', 'सुप्रभात', 'शुभ संध्या', 'शुभ रात्रि',
      'आप कैसे हैं', 'आपका नाम क्या है', 'आप कौन हैं', 'धन्यवाद', 'शुक्रिया',
      'अलविदा', 'मिलकर खुशी हुई', 'मदद', 'सहायता', 'आप क्या कर सकते हैं',
      'किसान मित्र', 'मित्र', 'सहायक', 'चैटबॉट', 'बॉट'
    ],
    bn: [
      'হাই', 'হ্যালো', 'নমস্কার', 'সুপ্রভাত', 'শুভ সন্ধ্যা', 'শুভ রাত্রি',
      'আপনি কেমন আছেন', 'আপনার নাম কি', 'আপনি কে', 'ধন্যবাদ', 'বিদায়',
      'সাহায্য', 'আপনি কি করতে পারেন', 'কিষান মিত্র', 'মিত্র', 'সহায়ক', 'চ্যাটবট'
    ]
  };
  
  // Check for greetings and basic conversational phrases first
  const currentLanguageGreetings = greetingKeywords[language] || greetingKeywords.en;
  const hasGreetings = currentLanguageGreetings.some(keyword => 
    lowercaseMessage.includes(keyword.toLowerCase())
  );
  
  if (hasGreetings) {
    return true; // Allow greetings and basic conversation
  }
  
  // Define agricultural keywords for different languages
  const agriculturalKeywords = {
    en: [
      // Basic farming terms
      'farm', 'farming', 'agriculture', 'crop', 'crops', 'harvest', 'plant', 'planting', 'seed', 'seeds',
      'soil', 'fertilizer', 'pesticide', 'irrigation', 'water', 'field', 'land', 'cultivation',
      
      // Specific crops
      'wheat', 'rice', 'corn', 'maize', 'barley', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion',
      'garlic', 'cabbage', 'carrot', 'beans', 'peas', 'soybean', 'sunflower', 'mustard', 'groundnut',
      
      // Farming activities
      'sowing', 'reaping', 'threshing', 'weeding', 'pruning', 'grafting', 'transplanting',
      
      // Farm equipment
      'tractor', 'plow', 'harrow', 'cultivator', 'seeder', 'harvester', 'thresher', 'sprayer',
      
      // Agricultural problems
      'pest', 'disease', 'weed', 'drought', 'flood', 'insect', 'fungus', 'virus', 'bacteria',
      
      // Livestock
      'cattle', 'cow', 'buffalo', 'goat', 'sheep', 'chicken', 'poultry', 'dairy', 'milk',
      
      // Agricultural business
      'mandi', 'market', 'price', 'profit', 'yield', 'production', 'subsidy', 'loan', 'insurance',
      
      // Weather and climate
      'weather', 'rain', 'monsoon', 'season', 'climate', 'temperature', 'humidity',
      
      // Organic farming
      'organic', 'natural', 'compost', 'manure', 'biofertilizer', 'sustainable'
    ],
    
    hi: [
      'खेती', 'किसान', 'कृषि', 'फसल', 'बीज', 'मिट्टी', 'खाद', 'पानी', 'सिंचाई', 'कटाई',
      'गेहूं', 'चावल', 'मक्का', 'कपास', 'गन्ना', 'आलू', 'टमाटर', 'प्याज', 'लहसुन',
      'ट्रैक्टर', 'हल', 'बुआई', 'कीट', 'रोग', 'खरपतवार', 'मंडी', 'बाजार', 'दाम',
      'मौसम', 'बारिश', 'मानसून', 'जैविक', 'खाद', 'गोबर', 'पशु', 'गाय', 'भैंस'
    ],
    
    bn: [
      'কৃষি', 'চাষ', 'কৃষক', 'ফসল', 'বীজ', 'মাটি', 'সার', 'পানি', 'সেচ', 'ফসল কাটা',
      'গম', 'ধান', 'ভুট্টা', 'তুলা', 'আখ', 'আলু', 'টমেটো', 'পেঁয়াজ', 'রসুন',
      'ট্রাক্টর', 'লাঙল', 'বপন', 'পোকা', 'রোগ', 'আগাছা', 'বাজার', 'দাম',
      'আবহাওয়া', 'বৃষ্টি', 'মৌসুম', 'জৈব', 'সার', 'গোবর', 'পশু', 'গরু', 'মহিষ'
    ]
  };
  
  // Define non-agricultural keywords that should be filtered out
  const nonAgriculturalKeywords = {
    en: [
      // Technology (non-agricultural)
      'computer', 'software', 'programming', 'coding', 'website', 'app', 'mobile', 'internet',
      'facebook', 'instagram', 'whatsapp', 'youtube', 'google', 'android', 'iphone',
      
      // Entertainment
      'movie', 'film', 'song', 'music', 'dance', 'actor', 'actress', 'bollywood', 'hollywood',
      'cricket', 'football', 'sports', 'game', 'match', 'player', 'team',
      
      // Education (non-agricultural)
      'school', 'college', 'university', 'exam', 'study', 'student', 'teacher', 'book',
      'mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography',
      
      // Health and medicine
      'doctor', 'hospital', 'medicine', 'treatment', 'surgery', 'fever', 'headache',
      'diabetes', 'blood pressure', 'heart', 'cancer', 'covid', 'vaccine',
      
      // Travel and tourism
      'travel', 'tour', 'hotel', 'flight', 'train', 'bus', 'ticket', 'vacation',
      'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
      
      // Personal and lifestyle
      'love', 'marriage', 'relationship', 'family', 'friend', 'birthday', 'party',
      'shopping', 'clothes', 'fashion', 'beauty', 'makeup', 'hair',
      
      // Politics and current affairs
      'election', 'vote', 'politician', 'government', 'minister', 'parliament',
      'news', 'newspaper', 'media', 'television', 'radio',
      
      // Business (non-agricultural)
      'job', 'career', 'salary', 'office', 'company', 'business', 'startup',
      'investment', 'stock', 'share', 'bank', 'money', 'finance'
    ],
    
    hi: [
      'कंप्यूटर', 'सॉफ्टवेयर', 'मोबाइल', 'इंटरनेट', 'फेसबुक', 'व्हाट्सएप', 'यूट्यूब',
      'फिल्म', 'गाना', 'संगीत', 'नृत्य', 'अभिनेता', 'बॉलीवुड', 'क्रिकेट', 'फुटबॉल',
      'स्कूल', 'कॉलेज', 'परीक्षा', 'पढ़ाई', 'छात्र', 'शिक्षक', 'किताब', 'गणित',
      'डॉक्टर', 'अस्पताल', 'दवा', 'इलाज', 'बुखार', 'सिरदर्द', 'मधुमेह', 'कैंसर',
      'यात्रा', 'होटल', 'फ्लाइट', 'ट्रेन', 'टिकट', 'दिल्ली', 'मुंबई', 'बैंगलोर',
      'प्रेम', 'शादी', 'रिश्ता', 'परिवार', 'दोस्त', 'जन्मदिन', 'खरीदारी', 'कपड़े',
      'चुनाव', 'वोट', 'नेता', 'सरकार', 'मंत्री', 'संसद', 'समाचार', 'अखबार',
      'नौकरी', 'करियर', 'तनख्वाह', 'ऑफिस', 'कंपनी', 'व्यापार', 'निवेश', 'बैंक'
    ],
    
    bn: [
      'কম্পিউটার', 'সফটওয়্যার', 'মোবাইল', 'ইন্টারনেট', 'ফেসবুক', 'হোয়াটসঅ্যাপ',
      'সিনেমা', 'গান', 'সঙ্গীত', 'নৃত্য', 'অভিনেতা', 'বলিউড', 'ক্রিকেট', 'ফুটবল',
      'স্কুল', 'কলেজ', 'পরীক্ষা', 'পড়াশোনা', 'ছাত্র', 'শিক্ষক', 'বই', 'গণিত',
      'ডাক্তার', 'হাসপাতাল', 'ওষুধ', 'চিকিৎসা', 'জ্বর', 'মাথাব্যথা', 'ডায়াবেটিস',
      'ভ্রমণ', 'হোটেল', 'ফ্লাইট', 'ট্রেন', 'টিকিট', 'ঢাকা', 'কলকাতা', 'চট্টগ্রাম',
      'ভালোবাসা', 'বিয়ে', 'সম্পর্ক', 'পরিবার', 'বন্ধু', 'জন্মদিন', 'কেনাকাটা',
      'নির্বাচন', 'ভোট', 'নেতা', 'সরকার', 'মন্ত্রী', 'সংসদ', 'সংবাদ', 'পত্রিকা',
      'চাকরি', 'ক্যারিয়ার', 'বেতন', 'অফিস', 'কোম্পানি', 'ব্যবসা', 'বিনিয়োগ', 'ব্যাংক'
    ]
  };
  
  const currentLanguageAgriKeywords = agriculturalKeywords[language] || agriculturalKeywords.en;
  const currentLanguageNonAgriKeywords = nonAgriculturalKeywords[language] || nonAgriculturalKeywords.en;
  
  // Check for non-agricultural keywords first (higher priority)
  const hasNonAgriKeywords = currentLanguageNonAgriKeywords.some(keyword => 
    lowercaseMessage.includes(keyword.toLowerCase())
  );
  
  if (hasNonAgriKeywords) {
    return false; // Definitely not agricultural
  }
  
  // Check for agricultural keywords
  const hasAgriKeywords = currentLanguageAgriKeywords.some(keyword => 
    lowercaseMessage.includes(keyword.toLowerCase())
  );
  
  // If message is very short (less than 3 words), be more lenient
  const wordCount = message.trim().split(/\s+/).length;
  if (wordCount < 3) {
    return true; // Allow short messages to pass through
  }
  
  // For longer messages, require at least one agricultural keyword
  return hasAgriKeywords;
};

// Get out-of-scope response message
export const getOutOfScopeResponse = (language = 'en') => {
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
  
  return outOfScopeResponses[language] || outOfScopeResponses.en;
};