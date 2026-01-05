'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Users, Plus, X, Sparkles, Utensils, Flame, Mail, MessageCircle, Copyright } from 'lucide-react';

interface Recipe {
  title: string;
  titleHindi: string;
  ingredients: string[];
  ingredientsHindi: string[];
  instructions: string[];
  instructionsHindi: string[];
  prepTime: string;
  prepTimeHindi: string;
  servings: number;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHindi, setIsHindi] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState('default');

  const ingredientThemes: { [key: string]: { image: string; overlay: string } } = {
    chicken: { 
      image: 'https://images.unsplash.com/photo-1582234372742-92e8961b4446?w=1920&h=1080&fit=crop',
      overlay: 'from-red-900/80 via-orange-900/70 to-yellow-900/60'
    },
    vegetable: { 
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1920&h=1080&fit=crop',
      overlay: 'from-green-900/80 via-emerald-900/70 to-teal-900/60'
    },
    tomato: { 
      image: 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=1920&h=1080&fit=crop',
      overlay: 'from-red-900/80 via-red-800/70 to-orange-900/60'
    },
    potato: { 
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/80 via-amber-900/70 to-orange-900/60'
    },
    onion: { 
      image: 'https://images.unsplash.com/photo-1582746467067-bbc87ba62ea5?w=1920&h=1080&fit=crop',
      overlay: 'from-purple-900/80 via-pink-900/70 to-red-900/60'
    },
    garlic: { 
      image: 'https://images.unsplash.com/photo-1551386258-945e9f98c651?w=1920&h=1080&fit=crop',
      overlay: 'from-gray-900/80 via-gray-800/70 to-slate-900/60'
    },
    rice: { 
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/80 via-orange-900/70 to-amber-900/60'
    },
    paneer: { 
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1920&h=1080&fit=crop',
      overlay: 'from-white/80 via-gray-200/70 to-slate-200/60'
    },
    lentil: { 
      image: 'https://images.unsplash.com/photo-1586737712304-7f21a1b4c4e9?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/80 via-orange-900/70 to-red-900/60'
    },
    spice: { 
      image: 'https://images.unsplash.com/photo-1532339142463-fd0a8979f1c3?w=1920&h=1080&fit=crop',
      overlay: 'from-red-900/80 via-orange-900/70 to-yellow-900/60'
    },
    default: { 
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop',
      overlay: 'from-orange-900/80 via-yellow-900/70 to-saffron-900/60'
    }
  };

  useEffect(() => {
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');
    if (validIngredients.length > 0) {
      const firstIngredient = validIngredients[0].toLowerCase();
      let theme = 'default';
      
      for (const [key, value] of Object.entries(ingredientThemes)) {
        if (key !== 'default' && firstIngredient.includes(key)) {
          theme = key;
          break;
        }
      }
      
      setBackgroundTheme(theme);
    } else {
      setBackgroundTheme('default');
    }
  }, [ingredients]);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const generateRecipe = async () => {
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');
    
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: validIngredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const generatedRecipe = await response.json();
      setRecipe(generatedRecipe);
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative py-6 px-4 sm:py-12 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* High-quality Background Image */}
      <motion.div
        className="fixed inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${ingredientThemes[backgroundTheme].image})`,
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${ingredientThemes[backgroundTheme].overlay}`} />
      </motion.div>

      {/* Subtle floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-20">

        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Indian Recipe Generator
              </h1>
              <motion.div 
                className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {isHindi ? 'बताइए आपके पास कौन सी सामग्री है, हम आपके लिए एक स्वादिष्ट भारतीय व्यंजन बनाएंगे!' : 'Tell us what ingredients you have, and we\'ll create a delicious Indian recipe for you!'}
          </motion.p>
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-xl"
            >
              {isHindi ? '🇬🇧 English' : '🇮🇳 हिंदी'}
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {isHindi ? 'आपकी सामग्री' : 'Your Ingredients'}
            </h2>
          </motion.div>
          
          <div className="space-y-4 mb-8">
            {ingredients.map((ingredient, index) => (
              <motion.div 
                key={index} 
                className="flex gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={isHindi ? "जैसे: मुर्गी, टमाटर, लहसुन" : "e.g., chicken, tomatoes, garlic"}
                  className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-300"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(index)}
                    className="px-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={addIngredient}
              className="px-6 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {isHindi ? 'सामग्री जोड़ें' : 'Add Ingredient'}
            </motion.button>
            <motion.button
              onClick={generateRecipe}
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 shadow-2xl"
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="inline-flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                  </motion.div>
                  {isHindi ? 'व्यंजन बना रहे हैं...' : 'Generating Recipe...'}
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-3" />
                  {isHindi ? 'व्यंजन बनाएं' : 'Generate Recipe'}
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div 
              className="mt-4 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white rounded-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {recipe && (
              <motion.div 
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
                    <Utensils className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {isHindi ? recipe.titleHindi : recipe.title}
                    </h2>
                    <motion.div 
                      className="h-0.5 bg-white/30 mt-2"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
            
            <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 text-white">
                    <Clock className="w-5 h-5 text-orange-300" />
                    <span className="font-medium">{isHindi ? 'समय:' : 'Cooking Time'}</span>
                    <span className="text-white/80">{isHindi ? recipe.prepTimeHindi : recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Users className="w-5 h-5 text-red-300" />
                    <span className="font-medium">{isHindi ? 'परोस:' : 'Servings'}</span>
                    <span className="text-white/80">{recipe.servings} {isHindi ? 'लोगों के लिए' : 'people'}</span>
                  </div>
                </motion.div>

            <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {isHindi ? 'सामग्री' : 'Ingredients'}
                    </h3>
                  </div>
                  <motion.ul 
                    className="space-y-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    {(isHindi ? recipe.ingredientsHindi : recipe.ingredients).map((ingredient, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-center gap-4 text-white/90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 1, duration: 0.5 }}
                      >
                        <div className="w-2 h-2 bg-white/60 rounded-full" />
                        <span className="leading-relaxed">{ingredient}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

<motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {isHindi ? 'बनाने का तरीका' : 'Instructions'}
                    </h3>
                  </div>
                  <motion.ol 
                    className="space-y-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    {(isHindi ? recipe.instructionsHindi : recipe.instructions).map((instruction, index) => (
                      <motion.li 
                        key={index} 
                        className="flex gap-4 text-white/90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 1.5, duration: 0.5 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="leading-relaxed flex-1">{instruction}</span>
                      </motion.li>
                    ))}
                  </motion.ol>
                </motion.div>
              </motion.div>
            )}

        {/* Footer */}
        <motion.footer 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <motion.div 
                className="flex items-center gap-2 text-gray-600"
                whileHover={{ scale: 1.05 }}
              >
                <Copyright className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Made by Neetesh Jatav 2025
                </span>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.a
                href="mailto:neeteshjatav11@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">neeteshjatav11@gmail.com</span>
              </motion.a>
              
              <motion.a
                href="mailto:neeteshjatav19@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">neeteshjatav19@gmail.com</span>
              </motion.a>
              
              <motion.a
                href="https://wa.me/918103054195"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">WhatsApp</span>
              </motion.a>
            </div>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}
