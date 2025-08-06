import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Star, Search, Filter, MapPin, User, Home, Heart, Clock, Minus, Plus, ArrowLeft, Mic, MicOff, X, CheckCircle, Truck, CreditCard, ChevronRight, Phone, MessageCircle, Brain, Zap, Target, TrendingUp, Award, Eye, Sparkles, Settings, Bell, Database, Wifi, WifiOff, BarChart3, Gift, Send, Bot } from 'lucide-react';

const WingsRUsAI = () => {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [mqttConnected, setMqttConnected] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [llmProcessing, setLlmProcessing] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [realTimeAnalytics, setRealTimeAnalytics] = useState({
    orderVolume: 247,
    avgOrderValue: 28.50,
    aiAccuracy: 96.8,
    customerSatisfaction: 4.9
  });

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI assistant. I can help you find the perfect wings, suggest pairings, take voice commands, or answer any questions about our menu!",
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const chatMessagesRef = useRef(null);

  // Loyalty Program State
  const [loyaltyPoints, setLoyaltyPoints] = useState(1247);
  const [loyaltyTier, setLoyaltyTier] = useState('Gold');
  const [personalizedOffers, setPersonalizedOffers] = useState([
    { id: 1, title: "20% Off Spicy Wings", description: "Your favorite! Valid until tonight", discount: 20, code: "SPICY20" },
    { id: 2, title: "Free Ranch Dip", description: "With any wing order over $15", discount: 0, code: "FREERANCH" },
    { id: 3, title: "Combo Upgrade", description: "Upgrade any meal to combo for +$2", discount: 15, code: "UPGRADE2" }
  ]);
  const [pastOrders, setPastOrders] = useState([
    { id: 1, date: "2025-01-15", items: ["10pc Spicy Wings", "Ranch Dip", "20 Oz Soft Drink"], total: 15.99, rating: 5 },
    { id: 2, date: "2025-01-10", items: ["Chicken Sub Combo", "Large Buffalo Fries"], total: 18.49, rating: 4 },
    { id: 3, date: "2025-01-05", items: ["20pc Grilled Wings", "Bleu Cheese Dip"], total: 21.48, rating: 5 }
  ]);
  const [orderType, setOrderType] = useState('delivery'); // delivery or pickup

  // AI Recommendation Database
  const aiRecommendationDatabase = {
    menuItems: [
      "Chicken Sub Combo", "Ranch Dip - Regular", "10 pc Spicy Wings Combo", "Regular Buffalo Fries",
      "10 pc Spicy Wings", "3 pc Crispy Strips Combo", "Large Buffalo Fries", "6 pc Grilled Wings Combo", 
      "20 pc Grilled Wings", "Fried Corn - Large", "Ranch Dip - Large", "Chicken Sub", "Veggie Sticks Spicy",
      "Add 5 Spicy Wings", "8 pc Spicy Wings Combo", "Fried Corn - Regular", "8 pc Grilled Wings Combo",
      "15 pc Spicy Wings Combo", "5 pc Crispy Strips Combo", "Voodoo Fries - Regular", "Voodoo Fries - Large",
      "20 Oz Soft Drink", "Fresh Lemonade", "Bleu Cheese Dip", "Celery Sticks", "Large Seasoned Fries",
      "Extra Ranch Dip", "Garlic Parmesan Dip", "Buffalo Dip", "Hot Sauce - Side"
    ],
    
    getRecommendations: (cartItems) => {
      const cartNames = cartItems.map(item => item.name);
      let recommendations = [];
      
      const hasWings = cartNames.some(name => 
        name.includes('Wings') || name.includes('Spicy Wings') || name.includes('Grilled Wings')
      );
      const hasRanch = cartNames.some(name => name.includes('Ranch'));
      
      if (hasWings && !hasRanch) {
        recommendations.push({
          name: "Ranch Dip - Regular",
          confidence: 0.987,
          reason: "98.7% of wing orders include ranch dip",
          pattern: "wings_no_ranch",
          frequency: 987
        });
      }
      
      const hasSpicy = cartNames.some(name => 
        name.includes('Spicy') || name.includes('Buffalo') || name.includes('Hot')
      );
      const hasDrink = cartNames.some(name => 
        name.includes('Drink') || name.includes('Soda') || name.includes('Lemonade')
      );
      
      if (hasSpicy && !hasDrink) {
        recommendations.push({
          name: "20 Oz Soft Drink",
          confidence: 0.942,
          reason: "94.2% of spicy orders need cooling beverages",
          pattern: "spicy_no_drink", 
          frequency: 942
        });
      }
      
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const hasLargeSides = cartNames.some(name => name.includes('Large') && name.includes('Fries'));
      
      if (totalItems >= 2 && !hasLargeSides) {
        recommendations.push({
          name: "Large Buffalo Fries", 
          confidence: 0.893,
          reason: "89.3% of multi-item orders upgrade to large sides",
          pattern: "multi_item_no_large_side",
          frequency: 893
        });
      }
      
      if (hasWings && hasRanch && !cartNames.some(name => name.includes('Celery'))) {
        recommendations.push({
          name: "Celery Sticks",
          confidence: 0.764,
          reason: "76.4% add celery for complete wing experience",
          pattern: "wings_ranch_no_celery",
          frequency: 764
        });
      }
      
      const hasCombo = cartNames.some(name => name.includes('Combo'));
      const extraDips = cartNames.filter(name => name.includes('Dip')).length;
      
      if (hasCombo && extraDips <= 1) {
        recommendations.push({
          name: "Extra Ranch Dip",
          confidence: 0.821,
          reason: "82.1% of combo orders add extra dipping sauce",
          pattern: "combo_needs_extra_dip",
          frequency: 821
        });
      }
      
      const hasSub = cartNames.some(name => name.includes('Sub'));
      const hasFries = cartNames.some(name => name.includes('Fries'));
      
      if (hasSub && !hasFries) {
        recommendations.push({
          name: "Large Seasoned Fries",
          confidence: 0.917,
          reason: "91.7% of sub orders pair with fries",
          pattern: "sub_no_fries", 
          frequency: 917
        });
      }
      
      const totalCalories = cartItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
      if (totalCalories > 800 && !hasDrink) {
        recommendations.push({
          name: "Fresh Lemonade",
          confidence: 0.886,
          reason: "88.6% of high-calorie orders need beverages",
          pattern: "high_calorie_no_drink",
          frequency: 886
        });
      }
      
      return recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(rec => {
          const menuItem = allItems.find(item => item.name === rec.name) || {
            id: Date.now() + Math.random(),
            name: rec.name,
            price: 2.99,
            image: rec.name.includes('Ranch') ? '🥄' : rec.name.includes('Drink') ? '🥤' : rec.name.includes('Fries') ? '🍟' : rec.name.includes('Celery') ? '🥬' : '🍽️',
            category: rec.name.includes('Dip') ? 'Dips' : rec.name.includes('Drink') || rec.name.includes('Lemonade') ? 'Drinks' : 'Sides',
            rating: 4.5 + (rec.confidence * 0.5),
            time: '2-5 min',
            calories: 150,
            description: `Recommended based on ${Math.floor(rec.frequency)} similar orders`
          };
          
          return {
            ...menuItem,
            confidence: rec.confidence,
            reason: rec.reason,
            pattern: rec.pattern,
            frequency: rec.frequency,
            mlModel: "Neural Network",
            isAIRecommendation: true
          };
        });
    }
  };

  // Enhanced menu with real Wings R Us items
  const menuItems = {
    "Wings": [
      { id: 1, name: "10 pc Spicy Wings", price: 12.99, image: "🔥", rating: 4.8, time: "12-15 min", description: "Classic buffalo wings with celery sticks", category: "Wings", popular: true, spicy: true, calories: 580 },
      { id: 2, name: "20 pc Grilled Wings", price: 18.99, image: "🍗", rating: 4.7, time: "15-18 min", description: "Grilled wings with signature seasoning", category: "Wings", calories: 640 },
      { id: 3, name: "6 pc Grilled Wings Combo", price: 14.99, image: "🍗", rating: 4.9, time: "12-15 min", description: "Grilled wings with fries and drink", category: "Wings", popular: true, calories: 750 },
      { id: 4, name: "8 pc Spicy Wings Combo", price: 16.99, image: "🔥", rating: 4.6, time: "15-18 min", description: "Spicy wings combo with sides", category: "Wings", spicy: true, calories: 820 },
      { id: 5, name: "6pc Boneless Wings", price: 11.99, image: "🍗", rating: 4.5, time: "10-12 min", description: "Tender boneless wings", category: "Wings", calories: 480 }
    ],
    "Combos": [
      { id: 11, name: "Chicken Sub Combo", price: 13.99, image: "🥪", rating: 4.7, time: "8-12 min", description: "Chicken sub with fries and drink", category: "Combos", popular: true, calories: 890 },
      { id: 12, name: "3 pc Crispy Strips Combo", price: 12.99, image: "🍖", rating: 4.8, time: "10-15 min", description: "Crispy chicken strips with sides", category: "Combos", calories: 720 }
    ],
    "Sides": [
      { id: 21, name: "Large Buffalo Fries", price: 6.99, image: "🍟", rating: 4.6, time: "5-8 min", description: "Buffalo-seasoned crispy fries", category: "Sides", popular: true, spicy: true, calories: 420 },
      { id: 22, name: "Regular Buffalo Fries", price: 4.99, image: "🍟", rating: 4.4, time: "5-8 min", description: "Regular buffalo fries", category: "Sides", spicy: true, calories: 320 },
      { id: 23, name: "Large Seasoned Fries", price: 5.99, image: "🍟", rating: 4.7, time: "5-8 min", description: "Large seasoned crispy fries", category: "Sides", calories: 380 },
      { id: 24, name: "Fried Corn - Large", price: 5.49, image: "🌽", rating: 4.3, time: "6-10 min", description: "Southern fried corn kernels", category: "Sides", calories: 290 },
      { id: 25, name: "Fried Corn - Regular", price: 3.99, image: "🌽", rating: 4.2, time: "6-10 min", description: "Regular fried corn", category: "Sides", calories: 210 },
      { id: 26, name: "Celery Sticks", price: 2.99, image: "🥬", rating: 4.0, time: "2 min", description: "Fresh celery with ranch", category: "Sides", vegetarian: true, calories: 25 }
    ],
    "Dips": [
      { id: 31, name: "Ranch Dip - Regular", price: 1.99, image: "🥄", rating: 4.5, time: "1 min", description: "Classic ranch dipping sauce", category: "Dips", popular: true, calories: 150 },
      { id: 32, name: "Ranch Dip - Large", price: 2.99, image: "🥄", rating: 4.6, time: "1 min", description: "Large ranch dipping sauce", category: "Dips", calories: 240 },
      { id: 33, name: "Bleu Cheese Dip", price: 2.49, image: "🧀", rating: 4.3, time: "1 min", description: "Premium bleu cheese dip", category: "Dips", calories: 180 },
      { id: 34, name: "Extra Ranch Dip", price: 1.49, image: "🥄", rating: 4.4, time: "1 min", description: "Extra portion ranch dip", category: "Dips", calories: 120 }
    ],
    "Drinks": [
      { id: 41, name: "20 Oz Soft Drink", price: 2.99, image: "🥤", rating: 4.5, time: "1 min", description: "Ice-cold soft drink selection", category: "Drinks", popular: true, calories: 140 },
      { id: 42, name: "Fresh Lemonade", price: 3.99, image: "🍋", rating: 4.6, time: "2 min", description: "Freshly squeezed lemonade", category: "Drinks", calories: 120 }
    ],
    "Subs": [
      { id: 51, name: "Chicken Sub", price: 9.99, image: "🥪", rating: 4.4, time: "8-12 min", description: "Grilled chicken submarine sandwich", category: "Subs", calories: 650 }
    ]
  };

  const allItems = Object.values(menuItems).flat();
  const categories = ['All', ...Object.keys(menuItems)];

  // Enhanced chatbot responses
  const chatbotResponses = {
    greetings: [
      "Hello! Welcome to Wings R Us AI! How can I help you today?",
      "Hi there! I'm here to help you find the perfect meal. What are you craving?",
      "Hey! Ready to order some amazing wings? I can help with recommendations!"
    ],
    recommendations: [
      "Based on your preferences, I'd recommend our popular spicy wings with ranch dip!",
      "For a complete meal, try our Chicken Sub Combo - it's a customer favorite!",
      "If you like spicy food, our buffalo fries pair perfectly with any wing order!"
    ],
    help: [
      "I can help you with menu recommendations, nutritional info, order tracking, or finding specific items!",
      "Try asking me about spicy options, combos, or what goes well with wings!",
      "I can also take voice commands - just click the voice button!"
    ]
  };

  // Enhanced AI engine with chatbot integration
  const aiEngine = {
    processChatMessage: async (message) => {
      const lowerMessage = message.toLowerCase();
      
      // Intent recognition
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)];
      }
      
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        generateAIRecommendations();
        return "I've analyzed your cart and generated personalized recommendations! Check them out below. Based on our data, these items pair perfectly with what you've selected.";
      }
      
      if (lowerMessage.includes('spicy')) {
        const spicyItems = allItems.filter(item => item.spicy);
        if (spicyItems.length > 0) {
          const randomSpicy = spicyItems[Math.floor(Math.random() * spicyItems.length)];
          return `For spicy options, I recommend ${randomSpicy.name} (${randomSpicy.price}). It has a ${randomSpicy.rating} star rating! Don't forget to add a cooling drink.`;
        }
      }
      
      if (lowerMessage.includes('combo')) {
        const combos = allItems.filter(item => item.category === 'Combos');
        if (combos.length > 0) {
          const randomCombo = combos[Math.floor(Math.random() * combos.length)];
          return `Our ${randomCombo.name} is a great value at $${randomCombo.price}! It includes everything you need for a complete meal.`;
        }
      }
      
      if (lowerMessage.includes('popular') || lowerMessage.includes('best')) {
        const popularItems = allItems.filter(item => item.popular);
        return `Our most popular items are: ${popularItems.map(item => item.name).join(', ')}. These are customer favorites!`;
      }
      
      if (lowerMessage.includes('add') && lowerMessage.includes('wing')) {
        const wings = allItems.filter(item => item.category === 'Wings')[0];
        if (wings) {
          addToCart(wings);
          return `Added ${wings.name} to your cart! Perfect choice. Would you like me to suggest some sides to go with it?`;
        }
      }
      
      if (lowerMessage.includes('help')) {
        return chatbotResponses.help[Math.floor(Math.random() * chatbotResponses.help.length)];
      }
      
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our wings start at $11.99 for 6pc boneless, and our popular combos range from $12.99-$16.99. What's your budget range?";
      }
      
      if (lowerMessage.includes('delivery') || lowerMessage.includes('pickup')) {
        return `Current delivery time is 15-25 minutes to your area. Pickup is available in 10-15 minutes. You can switch between delivery and pickup anytime!`;
      }
      
      // Default response
      return `I'm here to help! You can ask me about our menu, get recommendations, add items to your cart, or ask about delivery times. What would you like to know?`;
    },

    processVoiceCommand: async (command) => {
      setLlmProcessing(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lowerCommand = command.toLowerCase();
      let response = "";
      let actionTaken = false;

      if (lowerCommand.includes('spicy') && lowerCommand.includes('wing')) {
        const spicyWings = allItems.find(item => item.name.includes('Spicy Wings'));
        if (spicyWings) {
          addToCart(spicyWings);
          response = `Added ${spicyWings.name} to your cart! 🔥 Based on your order pattern, I also recommend ranch dip to cool the heat.`;
          actionTaken = true;
        }
      } else if (lowerCommand.includes('combo')) {
        const combo = allItems.find(item => item.category === 'Combos' && item.popular);
        if (combo) {
          addToCart(combo);
          response = `Perfect! Added ${combo.name} to your cart. Great value choice! 📦`;
          actionTaken = true;
        }
      } else if (lowerCommand.includes('ranch') || lowerCommand.includes('dip')) {
        const ranch = allItems.find(item => item.name.includes('Ranch Dip - Regular'));
        if (ranch) {
          addToCart(ranch);
          response = `Added ranch dip! Essential for our wings. 🥄`;
          actionTaken = true;
        }
      } else if (lowerCommand.includes('drink') || lowerCommand.includes('beverage')) {
        const drink = allItems.find(item => item.name.includes('20 Oz Soft Drink'));
        if (drink) {
          addToCart(drink);
          response = `Added a refreshing drink to complete your meal! 🥤`;
          actionTaken = true;
        }
      } else if (lowerCommand.includes('recommend') || lowerCommand.includes('suggest')) {
        generateAIRecommendations();
        response = "I've analyzed your preferences and generated personalized recommendations! Check the recommendations section below. 🧠";
      }

      if (!actionTaken) {
        response = `I heard "${command}" - I'm processing this with my language model. Try saying "add spicy wings" or "I want a combo meal" for instant results! 🤖`;
      }

      setLlmProcessing(false);
      return response;
    },

    generateRecommendations: (cartItems) => {
      return aiRecommendationDatabase.getRecommendations(cartItems);
    }
  };

  // Chatbot functions
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate AI thinking
    const thinkingMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: 'Thinking...',
      timestamp: Date.now(),
      isThinking: true
    };
    
    setChatMessages(prev => [...prev, thinkingMessage]);
    
    // Get AI response
    const aiResponse = await aiEngine.processChatMessage(userMessage.content);
    
    // Replace thinking message with actual response
    setChatMessages(prev => prev.map(msg => 
      msg.isThinking ? {
        ...msg,
        content: aiResponse,
        isThinking: false
      } : msg
    ));
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // MQTT simulation for real-time commands
  const mqttManager = {
    connect: () => {
      setMqttConnected(true);
      console.log("MQTT Connected to Wings R Us Real-time Command Center");
    },
    
    disconnect: () => {
      setMqttConnected(false);
    },
    
    publishOrder: (orderData) => {
      if (!mqttConnected) return;
      
      console.log("Publishing order via MQTT:", orderData);
      
      setTimeout(() => {
        setOrderStatus({
          ...orderData,
          status: 'received',
          kitchenTime: new Date().toLocaleTimeString()
        });
      }, 1000);
    },
    
    subscribeToUpdates: () => {
      const interval = setInterval(() => {
        setRealTimeAnalytics(prev => ({
          ...prev,
          orderVolume: prev.orderVolume + Math.floor(Math.random() * 3) - 1,
          aiAccuracy: Math.min(99.9, prev.aiAccuracy + (Math.random() - 0.5) * 0.1),
          customerSatisfaction: Math.min(5.0, prev.customerSatisfaction + (Math.random() - 0.5) * 0.05)
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  };

  const generateAIRecommendations = () => {
    const recs = aiEngine.generateRecommendations(cart);
    setAiRecommendations(recs);
  };

  const handleVoiceCommand = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceCommand('Listening...');

    setTimeout(async () => {
      const simulatedCommands = [
        "Add 10 piece spicy wings with ranch dip",
        "I want a chicken combo meal",
        "Give me your most popular items",
        "Add a large buffalo fries and soft drink"
      ];
      
      const command = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
      setVoiceCommand(command);
      
      const response = await aiEngine.processVoiceCommand(command);
      
      setVoiceCommand(`Command: "${command}" - ${response}`);
      setIsListening(false);
      
      setTimeout(() => setVoiceCommand(''), 5000);
    }, 2000);
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    setLoyaltyPoints(prev => prev + Math.floor(item.price));
    setTimeout(generateAIRecommendations, 500);
  };

  const updateCartQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
    
    setTimeout(generateAIRecommendations, 500);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    setTimeout(generateAIRecommendations, 500);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const placeOrder = () => {
    const orderData = {
      orderNumber: Math.floor(Math.random() * 10000) + 1000,
      estimatedTime: Math.floor(Math.random() * 20) + 15,
      items: cart,
      total: cartTotal + 2.99 + (cartTotal * 0.0875),
      timestamp: new Date().toISOString()
    };
    
    mqttManager.publishOrder(orderData);
    setOrderStatus({ ...orderData, status: 'confirmed' });
    setCart([]);
    setCurrentView('order-status');
  };

  useEffect(() => {
    mqttManager.connect();
    const unsubscribe = mqttManager.subscribeToUpdates();
    generateAIRecommendations();
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      generateAIRecommendations();
    }
  }, [cart.length]);

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mobile Header with AI Status
  const MobileHeader = ({ title, showBack = false }) => (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {showBack ? (
          <button onClick={() => setCurrentView('home')} className="p-2 -ml-2">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">WR</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Wings R Us AI</h1>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <MapPin size={10} className="mr-1" />
                <span>Downtown • 15-25 min</span>
                <div className={`flex items-center ${mqttConnected ? 'text-green-600' : 'text-red-500'}`}>
                  {mqttConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
                  <span className="ml-1">MQTT</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="font-semibold text-gray-900">{title}</h2>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-right">
            <div className="text-yellow-600 font-bold">{loyaltyTier}</div>
            <div className="text-gray-500">{loyaltyPoints} pts</div>
          </div>
          <div className="text-xs text-right">
            <div className="text-green-600 font-bold">{realTimeAnalytics.aiAccuracy.toFixed(1)}%</div>
            <div className="text-gray-500">AI Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Command Center Component
  const AICommandCenter = () => (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 mx-4 rounded-xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain size={24} className="text-white" />
          <span className="text-white font-bold">AI Command Center</span>
        </div>
        <div className="flex items-center space-x-2 text-white text-sm">
          <div className={`w-2 h-2 rounded-full ${llmProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span>{llmProcessing ? 'Processing...' : 'Ready'}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleVoiceCommand}
          disabled={llmProcessing}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : llmProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-white text-purple-600 hover:bg-gray-50'
          }`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          <span className="text-sm">
            {isListening ? 'Stop Voice' : llmProcessing ? 'Processing...' : 'Voice AI'}
          </span>
        </button>
        
        <button
          onClick={() => setChatOpen(true)}
          className="flex-1 bg-white text-purple-600 hover:bg-gray-50 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
        >
          <MessageCircle size={18} />
          <span className="text-sm">Chat AI</span>
        </button>
      </div>
      
      {voiceCommand && (
        <div className="mt-3 p-3 bg-white/10 rounded-lg">
          <p className="text-white text-sm">{voiceCommand}</p>
        </div>
      )}
    </div>
  );

  // AI Recommendations Component
  const AIRecommendations = () => (
    aiRecommendations.length > 0 && (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center">
            <Sparkles className="mr-2 text-yellow-500" size={20} />
            AI Recommendations
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
              🤖 AI Powered
            </div>
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              1000+ Orders Analyzed
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {aiRecommendations.map((item, index) => (
            <div key={item.id} className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {(item.confidence * 100).toFixed(1)}% CONFIDENCE
                        </span>
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.frequency}/1000 Orders
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Brain size={20} className="text-blue-500" />
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        #{index + 1} Prediction
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center mb-1">
                      <Brain size={14} className="text-purple-600 mr-2" />
                      <span className="text-purple-800 font-medium text-sm">AI Analysis</span>
                    </div>
                    <p className="text-purple-700 text-sm font-medium">{item.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-2 border">
                      <div className="text-xs text-gray-500">ML Model</div>
                      <div className="font-semibold text-gray-800 text-xs">{item.mlModel}</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 border">
                      <div className="text-xs text-gray-500">Pattern</div>
                      <div className="font-semibold text-gray-800 text-xs">{item.pattern?.replace(/_/g, ' ')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-xl text-orange-500">${item.price}</span>
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-500 ml-1">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-colors flex items-center space-x-2 shadow-lg"
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Recommendation Confidence</span>
                      <span className="text-xs font-bold text-green-600">{(item.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.confidence > 0.95 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : item.confidence > 0.85 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {item.confidence > 0.95 && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg text-center">
                      <span className="text-sm font-bold">🤖 HIGH CONFIDENCE PREDICTION - 95%+ ACCURACY</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-gray-900 text-white rounded-xl p-4">
          <h4 className="font-bold mb-3 flex items-center">
            <Target size={16} className="mr-2 text-green-400" />
            AI Algorithm Performance
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {aiRecommendations.length > 0 ? (aiRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / aiRecommendations.length * 100).toFixed(1) : '0'}%
              </div>
              <div className="text-xs text-gray-400">Avg Confidence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {aiRecommendations.length > 0 ? Math.max(...aiRecommendations.map(rec => rec.frequency)) : 0}
              </div>
              <div className="text-xs text-gray-400">Max Pattern Freq</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{aiRecommendations.length}</div>
              <div className="text-xs text-gray-400">Active Predictions</div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // AI Chatbot Component
  const AIChatbot = () => (
    chatOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div className="bg-white w-full h-[80vh] rounded-t-2xl flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-sm opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {chatMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {message.isThinking ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-gray-600">Thinking...</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Action Buttons */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
              {[
                "Recommend spicy wings",
                "Show popular items",
                "Add combo meal",
                "Check delivery time",
                "Nutritional info"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setChatInput(suggestion);
                    setTimeout(() => sendChatMessage(), 100);
                  }}
                  className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs font-medium transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder="Ask me anything about our menu..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mic size={16} className="text-gray-400" />
                </div>
              </div>
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim()}
                className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Home View with AI Integration
  const HomeView = () => (
    <div className="pb-20">
      <MobileHeader title="" />
      
      <AICommandCenter />
      
      {/* Order Type Selection */}
      <div className="px-4 mb-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setOrderType('delivery')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              orderType === 'delivery' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-gray-600'
            }`}
          >
            🚚 Delivery
          </button>
          <button
            onClick={() => setOrderType('pickup')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              orderType === 'pickup' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-gray-600'
            }`}
          >
            🏪 Pickup
          </button>
        </div>
      </div>

      {/* Loyalty & Offers Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold">Gold Member</h4>
              <p className="text-sm opacity-90">{loyaltyPoints} loyalty points</p>
            </div>
            <div className="text-2xl">👑</div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Star size={14} className="mr-1" />
              <span>Next tier: 253 pts</span>
            </div>
            <div className="flex items-center">
              <Award size={14} className="mr-1" />
              <span>3 offers active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Offers */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
          <Gift size={20} className="mr-2 text-purple-500" />
          Your Offers
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {personalizedOffers.map(offer => (
            <div
              key={offer.id}
              className="flex-shrink-0 w-60 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-purple-800">{offer.title}</h4>
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {offer.discount > 0 ? `${offer.discount}% OFF` : 'FREE'}
                </span>
              </div>
              <p className="text-purple-700 text-sm mb-3">{offer.description}</p>
              <button className="w-full bg-purple-500 text-white py-2 rounded-lg text-sm font-medium">
                Use Code: {offer.code}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Real-time Analytics Dashboard */}
      <div className="px-4 mb-6">
        <div className="bg-gray-900 text-white p-4 rounded-xl">
          <h4 className="font-bold mb-3 flex items-center">
            <BarChart3 size={16} className="mr-2" />
            Live Analytics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{realTimeAnalytics.orderVolume}</div>
              <div className="text-xs text-gray-400">Orders/Hour</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">${realTimeAnalytics.avgOrderValue.toFixed(2)}</div>
              <div className="text-xs text-gray-400">Avg Order</div>
            </div>
          </div>
        </div>
      </div>

      <AIRecommendations />

      {/* Category Filters */}
      <div className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search wings, combos, sides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Featured Items */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
          <TrendingUp className="mr-2 text-orange-500" size={20} />
          Trending Now 🔥
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {allItems.filter(item => item.popular).map(item => (
            <div
              key={`featured-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="flex-shrink-0 w-44 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">{item.image}</div>
                  {item.spicy && <span className="text-red-500 text-sm">🌶️</span>}
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-orange-500">${item.price}</span>
                  <div className="flex items-center">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{item.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{item.calories} cal • {item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="px-4">
        <h3 className="font-bold text-lg text-gray-900 mb-3">
          {selectedCategory === 'All' ? 'All Menu Items' : selectedCategory}
        </h3>
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl">{item.image}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <div className="flex flex-col items-end space-y-1">
                    {item.popular && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                    {item.spicy && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🌶️ Spicy</span>
                    )}
                    {item.vegetarian && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">🌱 Veggie</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-orange-500">${item.price}</span>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-500 ml-1">{item.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500 ml-1">{item.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Item Detail Modal
  const ItemDetailModal = ({ item, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>
          
          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 text-center">
            <div className="text-6xl mb-4">{item.image}</div>
            <h2 className="font-bold text-2xl text-gray-900">{item.name}</h2>
            {item.spicy && <div className="text-red-500 text-lg mt-2">🌶️ Spicy Item</div>}
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="font-semibold ml-1">{item.rating}</span>
                  <span className="text-gray-500 ml-1">(124 reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock size={16} />
                  <span className="ml-1">{item.time}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Nutrition: </span>
                {item.calories} calories
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <Brain size={16} className="text-purple-600 mr-2" />
                <span className="text-purple-800 font-medium text-sm">AI Suggestion</span>
              </div>
              <p className="text-purple-700 text-sm">
                {item.category === 'Wings' && "Customers who order this also add Ranch Dip (94.7% match)"}
                {item.spicy && "Consider adding a cooling beverage - 92.3% of customers do!"}
                {item.category === 'Combos' && "Perfect meal deal - includes everything you need!"}
                {!item.category.match(/(Wings|Combos)/) && !item.spicy && "Popular choice that pairs well with our wing combos!"}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-2xl text-orange-500">${item.price}</span>
              </div>
              
              <button
                onClick={() => {
                  addToCart(item);
                  onClose();
                }}
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Cart View with AI Analysis
  const CartView = () => (
    <div className="pb-20">
      <MobileHeader title="Smart Cart" showBack={true} />
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center mb-6">Use our AI assistant to build the perfect meal!</p>
          <button
            onClick={() => setCurrentView('home')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 py-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl mb-4">
              <h4 className="font-bold mb-2 flex items-center">
                <Eye size={16} className="mr-2" />
                AI Cart Analysis
              </h4>
              <div className="text-sm space-y-1">
                <div>• {cart.length} items totaling {cart.reduce((sum, item) => sum + item.quantity, 0)} pieces</div>
                <div>• Total calories: {cart.reduce((sum, item) => sum + (item.calories * item.quantity), 0)}</div>
                <div>• {cart.some(item => item.spicy) ? 'Spicy items detected - consider cooling sides!' : 'Balanced flavor profile'}</div>
                <div>• AI Recommendation Score: {((cart.length / 5) * 100).toFixed(0)}% complete meal</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={`cart-${item.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-orange-500 font-bold">${item.price}</span>
                        {item.spicy && <span className="text-red-500 text-xs">🌶️</span>}
                        <span className="text-gray-500 text-xs">{item.calories}cal</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AIRecommendations />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard size={16} className="mr-2" />
                Order Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.0875).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>AI Optimization Savings</span>
                  <span>-$1.50</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">${(cartTotal + 2.99 + cartTotal * 0.0875 - 1.50).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800 text-sm">
                  <CheckCircle size={16} className="mr-2" />
                  <span>AI optimized for best value and taste pairing!</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={placeOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg mt-6 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Truck size={20} />
              <span>Place Order via MQTT</span>
              <Zap size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Enhanced Order Status with MQTT Real-time Updates
  const OrderStatusView = () => (
    <div className="pb-20">
      <MobileHeader title="Order Tracking" />
      
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500">Order #{orderStatus?.orderNumber}</p>
          <div className="flex items-center justify-center mt-2 text-sm text-green-600">
            <Wifi size={16} className="mr-1" />
            <span>Real-time MQTT tracking active</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Truck size={24} className="text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                <p className="text-orange-500 font-bold">{orderStatus?.estimatedTime} minutes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Delivery to</p>
              <p className="font-semibold text-gray-900">Downtown Seattle</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-900">AI Kitchen System Processing</span>
            </div>
            <div className="ml-6 space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                Order received via MQTT
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                AI optimized kitchen workflow
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-orange-500 rounded-full mr-2 animate-spin border-t-transparent"></div>
                Smart preparation in progress
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                Quality check & packaging
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                Out for delivery
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center text-blue-800 text-sm">
              <Brain size={16} className="mr-2" />
              <span>AI prediction: Your order will be ready 2 minutes early based on current kitchen load!</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{realTimeAnalytics.customerSatisfaction.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Satisfaction Score</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{realTimeAnalytics.aiAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">AI Accuracy</div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center space-x-2">
            <Phone size={20} />
            <span>Call Store</span>
          </button>
          <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2">
            <MessageCircle size={20} />
            <span>Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-pb">
      <div className="flex justify-around">
        {[
          { icon: Home, label: 'Home', view: 'home' },
          { icon: Heart, label: 'Orders', view: 'orders' },
          { icon: Award, label: 'Loyalty', view: 'loyalty' },
          { icon: User, label: 'Profile', view: 'profile' }
        ].map(({ icon: Icon, label, view }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === view ? 'text-orange-500' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Floating Cart Button
  const FloatingCartButton = () => (
    cartCount > 0 && currentView !== 'cart' && (
      <button
        onClick={() => setCurrentView('cart')}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg z-40 flex items-center space-x-2"
      >
        <ShoppingCart size={20} />
        <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {cartCount}
        </span>
      </button>
    )
  );

  // Floating Chat Button
  const FloatingChatButton = () => (
    !chatOpen && currentView !== 'cart' && (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-32 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg z-40 flex items-center justify-center"
      >
        <MessageCircle size={20} />
      </button>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render current view */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'cart' && <CartView />}
      {currentView === 'order-status' && <OrderStatusView />}
      
      {/* Past Orders View */}
      {currentView === 'orders' && (
        <div className="pb-20">
          <MobileHeader title="Order History" showBack={true} />
          <div className="p-4 space-y-4">
            {pastOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-500">${order.total}</div>
                    <div className="flex items-center">
                      {[...Array(order.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">• {item}</p>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    Reorder
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
                    Track Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loyalty Program View */}
      {currentView === 'loyalty' && (
        <div className="pb-20">
          <MobileHeader title="Loyalty Program" showBack={true} />
          <div className="p-4 space-y-6">
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl">
              <div className="text-center">
                <div className="text-4xl mb-2">👑</div>
                <h3 className="font-bold text-xl">Gold Member</h3>
                <p className="text-lg font-semibold">{loyaltyPoints} Points</p>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-4/5"></div>
                </div>
                <p className="text-sm mt-2 opacity-90">253 points to Platinum</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-3">Available Rewards</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold">Free 6pc Wings</h5>
                    <p className="text-sm text-gray-500">500 points</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Redeem
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold">$5 Off Order</h5>
                    <p className="text-sm text-gray-500">300 points</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Redeem
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between opacity-50">
                  <div>
                    <h5 className="font-semibold">Free Delivery Month</h5>
                    <p className="text-sm text-gray-500">1500 points</p>
                  </div>
                  <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    Need More Points
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-bold text-gray-900 mb-3">Earn More Points</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Every $1 spent</span>
                  <span className="font-semibold text-orange-500">+1 point</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate your order</span>
                  <span className="font-semibold text-orange-500">+25 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Refer a friend</span>
                  <span className="font-semibold text-orange-500">+100 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Birthday bonus</span>
                  <span className="font-semibold text-orange-500">+200 points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'profile' && (
        <div className="pb-20">
          <MobileHeader title="Profile" showBack={true} />
          <div className="p-4">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold mb-3">AI-Powered Profile</h4>
              <div className="space-y-2 text-sm">
                <p>• Preferred spice level: Medium</p>
                <p>• Favorite category: Wings</p>
                <p>• AI recommendation acceptance rate: 94.7%</p>
                <p>• Total orders enhanced by AI: 23</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Floating Buttons */}
      <FloatingCartButton />
      <FloatingChatButton />

      {/* Bottom Navigation */}
      {currentView !== 'cart' && currentView !== 'order-status' && <BottomNav />}

      {/* MQTT Status Indicator */}
      <div className="fixed top-16 right-4 z-40">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
          mqttConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mqttConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>MQTT</span>
        </div>
      </div>

      {/* Loading Overlay for LLM Processing */}
      {llmProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="font-medium">AI Processing Command...</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Advanced language model analyzing your request</p>
          </div>
        </div>
      )}

      {/* Safe area styles */}
      <style jsx global>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WingsRUsAI;

