export const LANGUAGES = [
    { value: 'en', label: 'English', nativeLabel: 'English' },
    { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
    { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
    { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
    { value: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
    { value: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
    { value: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
    { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
    { value: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
    { value: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
    { value: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
    { value: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
  ];
  
  const languagePatterns = {
    en: [/[a-zA-Z]/, /\b(what|how|why|when|who|where|which|can|could|would|should|is|are|am|was|were|do|does|did|has|have|had)\b/i],
    hi: [
      /[\u0900-\u097F]/,
      /\b(क्या|कैसे|क्यों|कब|कौन|कहां|कौनसा|है|हैं|था|थे|थी|करता|करते|करती|रहा|रहे|रही|सकता|सकते|सकती)\b/i,
      /\b(kya|kaise|kyun|kab|kaun|kahan|kaisa|hai|hain|tha|the|thi|karta|karte|karti|raha|rahe|rahi|sakta|sakte|sakti)\b/i
    ],
    bn: [
      /[\u0980-\u09FF]/,
      /\b(কি|কেমন|কেন|কখন|কে|কোথায়|কোনটি|আছে|ছিল|করে|করেন|করছে|করেছে|পারে|পারেন)\b/i
    ],
    te: [
      /[\u0C00-\u0C7F]/,
      /\b(ఏమి|ఎలా|ఎందుకు|ఎప్పుడు|ఎవరు|ఎక్కడ|ఏది|ఉంది|ఉన్నారు|చేస్తాను|చేస్తారు|చేస్తుంది|చేశాను|చేశారు|చేసింది)\b/i
    ],
    mr: [
      /[\u0900-\u097F]/,
      /\b(काय|कसे|का|केव्हा|कोण|कुठे|कोणते|आहे|आहेत|होता|होते|होती|करतो|करतात|करते|केला|केले|केली|शकतो|शकतात|शकते)\b/i
    ],
    ta: [
      /[\u0B80-\u0BFF]/,
      /\b(என்ன|எப்படி|ஏன்|எப்போது|யார்|எங்கே|எது|இருக்கிறது|இருக்கின்றன|செய்கிறேன்|செய்கிறார்|செய்கிறது|செய்தேன்|செய்தார்|செய்தது)\b/i
    ],
    ur: [
      /[\u0600-\u06FF]/,
      /\b(کیا|کیسے|کیوں|کب|کون|کہاں|کونسا|ہے|ہیں|تھا|تھے|تھی|کرتا|کرتے|کرتی|رہا|رہے|رہی|سکتا|سکتے|سکتی)\b/i
    ],
    gu: [
      /[\u0A80-\u0AFF]/,
      /\b(શું|કેવી રીતે|કેમ|ક્યારે|કોણ|ક્યાં|કયું|છે|હતું|હતા|હતી|કરે છે|કરે|કર્યું|કરી શકે|કરી શકો)\b/i
    ],
    kn: [
      /[\u0C80-\u0CFF]/,
      /\b(ಏನು|ಹೇಗೆ|ಯಾಕೆ|ಯಾವಾಗ|ಯಾರು|ಎಲ್ಲಿ|ಯಾವುದು|ಇದೆ|ಇದ್ದಾರೆ|ಮಾಡುತ್ತೇನೆ|ಮಾಡುತ್ತಾರೆ|ಮಾಡುತ್ತದೆ|ಮಾಡಿದೆ|ಮಾಡಿದರು|ಮಾಡಿತು)\b/i
    ],
    ml: [
      /[\u0D00-\u0D7F]/,
      /\b(എന്ത്|എങ്ങനെ|എന്തുകൊണ്ട്|എപ്പോൾ|ആര്|എവിടെ|ഏത്|ഉണ്ട്|ഉണ്ടായിരുന്നു|ചെയ്യുന്നു|ചെയ്യുന്നത്|ചെയ്തു|കഴിയും)\b/i
    ],
    pa: [
      /[\u0A00-\u0A7F]/,
      /\b(ਕੀ|ਕਿਵੇਂ|ਕਿਉਂ|ਕਦੋਂ|ਕੌਣ|ਕਿੱਥੇ|ਕਿਹੜਾ|ਹੈ|ਹਨ|ਸੀ|ਸਨ|ਕਰਦਾ|ਕਰਦੇ|ਕਰਦੀ|ਕੀਤਾ|ਕੀਤੇ|ਕੀਤੀ|ਸਕਦਾ|ਸਕਦੇ|ਸਕਦੀ)\b/i
    ],
    or: [
      /[\u0B00-\u0B7F]/,
      /\b(କଣ|କିପରି|କାହିଁକି|କେବେ|କିଏ|କେଉଁଠାରେ|କେଉଁଟି|ଅଛି|ଥିଲା|କରେ|କରନ୍ତି|କରୁଛି|କରିଛି|କରିପାରେ)\b/i
    ],
    as: [
      /[\u0980-\u09FF]/,
      /\b(কি|কেনে|কিয়|কেতিয়া|কোন|ক'ত|কোনটো|আছে|আছিল|কৰে|কৰিছে|কৰিছিল|পাৰে)\b/i
    ]
  };
  
  const languageTransliteration = {
    hi: ['hindi me', 'hindi mein', 'hindi bhasha', 'hindhi', 'hindhi me'],
    pa: ['punjabi me', 'punjabi mein', 'punjabi ch', 'punjabi vich', 'panjabi'],
    bn: ['bangla', 'bangla te', 'bengali te', 'banglay'],
    te: ['telugu lo', 'telugu mein', 'telugu bhasha'],
    mr: ['marathi madhe', 'marathi mein', 'marathi bhasha'],
    ta: ['tamil', 'tamil le', 'tamizh', 'tamizh le'],
    ur: ['urdu me', 'urdu mein', 'urdu zuban'],
    gu: ['gujarati ma', 'gujarati mein', 'gujarati bhasha'],
    kn: ['kannada', 'kannada dalli', 'kannad'],
    ml: ['malayalam', 'malayalam thil', 'malayalam bhasha'],
    or: ['odia re', 'odia bhasha', 'oriya'],
    as: ['axomiya', 'assamese', 'asamiya'],
    en: ['english', 'english me', 'angreji']
  };
  
  const regionalIdentifiers = {
    hi: ['accha', 'theek hai', 'haan', 'nahi', 'apna', 'matlab', 'lekin', 'aur', 'mujhe', 'humko', 'tumko', 'unko'],
    pa: ['tainu', 'mainu', 'ehnu', 'ki haal', 'changa', 'theek', 'haan ji', 'nahi ji', 'te', 'par', 'kinna', 'kithe'],
    bn: ['ki', 'thik ache', 'hya', 'na', 'amar', 'tomar', 'kintu', 'ebong', 'amake', 'tomake', 'take', 'oder'],
    te: ['enti', 'sare', 'avunu', 'ledu', 'naa', 'nee', 'vari', 'kani', 'naku', 'neeku', 'vaadu', 'idi'],
    mr: ['kay', 'barr', 'ho', 'nahi', 'majha', 'tumcha', 'pan', 'aani', 'mala', 'tula', 'tyala', 'tyancha'],
    ta: ['enna', 'seri', 'ama', 'illai', 'en', 'un', 'avar', 'anal', 'enakku', 'unakku', 'avarukku', 'idhu'],
    ur: ['kia', 'theek', 'han', 'nahi', 'mera', 'tumhara', 'lekin', 'aur', 'mujhe', 'tumhe', 'unhe', 'uska'],
    gu: ['shu', 'barabar', 'ha', 'na', 'maru', 'tamaru', 'pan', 'ane', 'mane', 'tamne', 'ene', 'aa'],
    kn: ['enu', 'sari', 'haudu', 'illa', 'nanna', 'ninna', 'adara', 'aadare', 'nanage', 'ninage', 'avarigie', 'idu'],
    ml: ['enthu', 'shari', 'athe', 'alla', 'ente', 'ninte', 'avante', 'pakshe', 'enikku', 'ninakku', 'avannu', 'ithu'],
    or: ['kana', 'thik', 'ha', 'nahi', 'mora', 'tumara', 'kintu', 'ebong', 'mote', 'tumaku', 'tanku', 'semanaku'],
    as: ['ki', 'thik', 'hoi', 'nohoi', 'mur', 'tomar', 'kintu', 'aru', 'mok', 'tomak', 'tak', 'xihatôk'],
    en: ['okay', 'alright', 'yes', 'no', 'mine', 'yours', 'but', 'and', 'me', 'you', 'them', 'this']
  };
  
  export const detectLanguage = async (text) => {
    if (!text) return 'en';
    
    const lowercaseText = text.toLowerCase();
  
    for (const [lang, transliterations] of Object.entries(languageTransliteration)) {
      if (transliterations.some(phrase => lowercaseText.includes(phrase))) {
        return lang;
      }
    }
    
    if (/[\u0900-\u097F]/.test(text)) {
      if (/\b(आहे|आहेत|होता|होते|होती|करतो|करतात|करते|काय|कसे)\b/i.test(text)) {
        return 'mr';
      }
      return 'hi';
    }
    
    if (/[\u0980-\u09FF]/.test(text)) {
      if (/\b(অসমীয়া|কেনে|কিয়|কেতিয়া|ক'ত)\b/i.test(text)) {
        return 'as';
      }
      return 'bn';
    }
    
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    if (/[\u0600-\u06FF]/.test(text)) return 'ur';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
    if (/[\u0B00-\u0B7F]/.test(text)) return 'or';
    
    const languageScores = {
      'en': 0, 'hi': 0, 'bn': 0, 'te': 0, 'mr': 0, 'ta': 0, 
      'ur': 0, 'gu': 0, 'kn': 0, 'ml': 0, 'pa': 0, 'or': 0, 'as': 0
    };
    
    for (const [lang, patterns] of Object.entries(languagePatterns)) {
      for (const pattern of patterns) {
        if (typeof pattern === 'string') {
          if (lowercaseText.includes(pattern)) {
            languageScores[lang] += 2;
          }
        } else if (pattern.test(text)) {
          languageScores[lang] += 2;
        }
      }
    }
    
    for (const [lang, identifiers] of Object.entries(regionalIdentifiers)) {
      for (const word of identifiers) {
        const pattern = new RegExp(`\\b${word}\\b`, 'i');
        if (pattern.test(lowercaseText)) {
          languageScores[lang] += 3;
        }
      }
    }
    
    if (/[a-zA-Z]/.test(text)) {
      const hinglishPatterns = [
        /\b(kya|kaise|kyun|kab|kaun|kahan|kaisa|hai|hain|tha|kar|sakta|mein|ko|se)\b/i,
        /\b(nahi|acha|theek|haan|matlab|lekin|aur|mujhe|tumko|unko|hamara|apna)\b/i,
        /\b(baat|kaam|samay|din|log|aadmi|jyada|kam|bahut|thoda|pata|dekho)\b/i,
        /\b(chalo|jao|aao|karo|bolo|suno|likho|padho|khao|piyo|socho|batao)\b/i
      ];
      
      const punjabiPatterns = [
        /\b(ki|kivein|kithon|kithe|kihda|kinu|mainu|tainu|sanu|ehnu|ohnu|asi|tusi)\b/i,
        /\b(changa|thik|haan|nahi|par|te|kinne|kinna|jyada|ghat|bahut|thoda)\b/i,
        /\b(pind|shehar|din|raat|ghar|kamm|lok|banda|jatt|pendu|deho|veho)\b/i,
        /\b(karo|jao|aao|khao|pio|soccho|dasso|sunno|likho|padho|vekho)\b/i
      ];
      
      for (const pattern of hinglishPatterns) {
        if (pattern.test(lowercaseText)) {
          languageScores['hi'] += 1;
        }
      }
      
      for (const pattern of punjabiPatterns) {
        if (pattern.test(lowercaseText)) {
          languageScores['pa'] += 1;
        }
      }
    }
    
    if (lowercaseText.includes('punjab') || 
        lowercaseText.includes('पंजाब') || 
        lowercaseText.includes('ਪੰਜਾਬ')) {
      if (languageScores['hi'] > 0) {
        languageScores['hi'] += 3;
      }
      if (languageScores['pa'] > 0) {
        languageScores['pa'] += 5;
      }
    }
    
    let detectedLanguage = 'en';
    let highestScore = 0;
    
    for (const [lang, score] of Object.entries(languageScores)) {
      if (score > highestScore) {
        highestScore = score;
        detectedLanguage = lang;
      }
    }
    
    return detectedLanguage;
  };
  
  export const getWelcomeMessage = (language) => {
    switch(language) {
      case 'hi':
        return 'किसान मित्र में आपका स्वागत है! मैं आपकी कृषि संबंधी सवालों में मदद कर सकता हूं। आप मुझसे फसलों, कृषि प्रथाओं या बाजार जानकारी के बारे में पूछ सकते हैं। आप **बोल** भी सकते हैं और जवाब **सुन** सकते हैं!';
      
      case 'bn':
        return 'কিসান মিত্রে আপনাকে স্বাগতম! আমি আপনার কৃষি সম্পর্কিত প্রশ্নে সাহায্য করতে পারি। আপনি আমাকে ফসল, কৃষি পদ্ধতি বা বাজার তথ্য সম্পর্কে জিজ্ঞাসা করতে পারেন। আপনি **কথা বলতে** পারেন এবং উত্তর **শুনতে** পারেন!';
      
      case 'te':
        return 'కిసాన్ మిత్ర కు స్వాగతం! నేను మీ వ్యవసాయ సంబంధిత ప్రశ్నలకు సహాయపడగలను. మీరు నన్ను పంటలు, వ్యవసాయ పద్ధతులు లేదా మార్కెట్ సమాచారం గురించి అడగవచ్చు. మీరు **మాట్లాడవచ్చు** మరియు సమాధానాలు **వినవచ్చు**!';
      
      case 'mr':
        return 'किसान मित्र मध्ये आपले स्वागत आहे! मी तुमच्या शेती संबंधित प्रश्नांमध्ये मदत करू शकतो. तुम्ही मला पिके, शेती पद्धती किंवा बाजारपेठेची माहिती विचारू शकता. तुम्ही **बोलू** शकता आणि उत्तरे **ऐकू** शकता!';
      
      case 'ta':
        return 'கிசான் மித்ராவுக்கு வருக! நான் உங்கள் விவசாயம் தொடர்பான கேள்விகளுக்கு உதவ முடியும். நீங்கள் என்னிடம் பயிர்கள், விவசாய முறைகள் அல்லது சந்தை தகவல்களைப் பற்றி கேட்கலாம். நீங்கள் **பேசலாம்** மற்றும் பதில்களைக் **கேட்கலாம்**!';
      
      case 'ur':
        return 'کسان مترا میں خوش آمدید! میں آپ کے زراعت سے متعلق سوالات میں مدد کر سکتا ہوں۔ آپ مجھ سے فصلوں، زراعت کے طریقوں یا مارکیٹ کی معلومات کے بارے میں پوچھ سکتے ہیں۔ آپ **بول** بھی سکتے ہیں اور جوابات **سن** سکتے ہیں!';
      
      case 'gu':
        return 'કિસાન મિત્રમાં આપનું સ્વાગત છે! હું તમારા કૃષિ સંબંધિત પ્રશ્નોમાં મદદ કરી શકું છું. તમે મને પાક, ખેતી પદ્ધતિઓ અથવા બજાર માહિતી વિશે પૂછી શકો છો. તમે **બોલી** શકો છો અને જવાબો **સાંભળી** શકો છો!';
      
      case 'kn':
        return 'ಕಿಸಾನ್ ಮಿತ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ನನ್ನನ್ನು ಬೆಳೆಗಳು, ಕೃಷಿ ಪದ್ಧತಿಗಳು ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು. ನೀವು **ಮಾತನಾಡಬಹುದು** ಮತ್ತು ಉತ್ತರಗಳನ್ನು **ಕೇಳಬಹುದು**!';
      
      case 'ml':
        return 'കിസാൻ മിത്രയിലേക്ക് സ്വാഗതം! എനിക്ക് നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങളിൽ സഹായിക്കാൻ കഴിയും. നിങ്ങൾക്ക് എന്നോട് വിളകൾ, കൃഷി രീതികൾ അല്ലെങ്കിൽ വിപണി വിവരങ്ങളെക്കുറിച്ച് ചോദിക്കാം. നിങ്ങൾക്ക് **സംസാരിക്കാം** കൂടാതെ ഉത്തരങ്ങൾ **കേൾക്കാം**!';
      
      case 'pa':
        return 'ਕਿਸਾਨ ਮਿੱਤਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਡੇ ਖੇਤੀਬਾੜੀ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲਾਂ, ਖੇਤੀ ਦੇ ਤਰੀਕਿਆਂ ਜਾਂ ਮਾਰਕੀਟ ਜਾਣਕਾਰੀ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ **ਬੋਲ** ਵੀ ਸਕਦੇ ਹੋ ਅਤੇ ਜਵਾਬ **ਸੁਣ** ਸਕਦੇ ਹੋ!';
      
      case 'or':
        return 'କିସାନ ମିତ୍ରରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ମୁଁ ଆପଣଙ୍କର କୃଷି ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆପଣ ମୋତେ ଫସଲ, କୃଷି ପଦ୍ଧତି କିମ୍ବା ବଜାର ସୂଚନା ବିଷୟରେ ପଚାରିପାରିବେ। ଆପଣ **କହିପାରିବେ** ଏବଂ ଉତ୍ତର **ଶୁଣିପାରିବେ**!';
      
      case 'as':
        return 'কিচান মিত্ৰলৈ আদৰণি! মই আপোনাৰ কৃষি সম্পৰ্কীয় প্ৰশ্নত সহায় কৰিব পাৰোঁ। আপুনি মোক শস্য, কৃষি পদ্ধতি বা বজাৰৰ তথ্য সম্পৰ্কে সুধিব পাৰে। আপুনি **কথা কব** পাৰে আৰু উত্তৰবোৰ **শুনিব** পাৰে!';
      
      default:
        return 'Welcome to the Kisan Mitra! How can I help you today? You can ask me anything related to farming, crops, agricultural practices, or market information. You can also **speak** your questions and **listen** to the answers!';
    }
  };