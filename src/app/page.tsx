'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Users, Plus, X, Sparkles, Utensils, Flame, Mail, MessageCircle, Copyright, Share2, Printer } from 'lucide-react';

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
      image: 'https://images.unsplash.com/photo-1596797038594-1019612189b9?w=1920&h=1080&fit=crop',
      overlay: 'from-red-900/70 via-orange-900/60 to-yellow-900/50'
    },
    vegetable: {
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&h=1080&fit=crop',
      overlay: 'from-green-900/70 via-emerald-900/60 to-teal-900/50'
    },
    tomato: {
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1920&h=1080&fit=crop',
      overlay: 'from-red-800/90 via-red-700/80 to-orange-800/70'
    },
    potato: {
      image: 'https://images.unsplash.com/photo-1571091718805-9c6532a386f7?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/70 via-amber-900/60 to-orange-900/50'
    },
    onion: {
      image: 'https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=1920&h=1080&fit=crop',
      overlay: 'from-purple-900/70 via-pink-900/60 to-red-900/50'
    },
    garlic: {
      image: 'https://images.unsplash.com/photo-1551386258-945e9f98c651?w=1920&h=1080&fit=crop',
      overlay: 'from-gray-900/70 via-gray-800/60 to-slate-900/50'
    },
    rice: {
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/70 via-orange-900/60 to-amber-900/50'
    },
    paneer: {
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1920&h=1080&fit=crop',
      overlay: 'from-white/80 via-gray-200/70 to-slate-200/60'
    },
    lentil: {
      image: 'https://images.unsplash.com/photo-1586737712304-7f21a1b4c4e9?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/70 via-orange-900/60 to-red-900/50'
    },
    egg: {
      image: 'https://images.unsplash.com/photo-1512156320937-5c6755b13e44?w=1920&h=1080&fit=crop',
      overlay: 'from-yellow-900/70 via-amber-900/60 to-orange-900/50'
    },
    spice: {
      image: 'https://images.unsplash.com/photo-1532339142463-fd0a8979f1c3?w=1920&h=1080&fit=crop',
      overlay: 'from-red-900/70 via-orange-900/60 to-yellow-900/50'
    },
    default: {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop',
      overlay: 'from-orange-900/70 via-yellow-900/60 to-saffron-900/50'
    }
  };

  const [recipeBackground, setRecipeBackground] = useState<string | null>(null);

  useEffect(() => {
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');
    if (validIngredients.length > 0) {
      let theme = 'default';

      // More precise ingredient matching
      const ingredientMap: { [key: string]: string[] } = {
        chicken: ['chicken', 'murgi', 'murgh'],
        vegetable: ['vegetable', 'sabzi', 'veg', 'carrot', 'beans', 'peas', 'cabbage', 'cauliflower', 'spinach', 'ladyfinger'],
        tomato: ['tomato', 'tamatar', 'tomatoes'],
        potato: ['potato', 'aloo', 'potatoes'],
        onion: ['onion', 'pyaz', 'onions'],
        garlic: ['garlic', 'lahsun'],
        rice: ['rice', 'chawal', 'basmati'],
        paneer: ['paneer', 'cottage cheese'],
        lentil: ['lentil', 'dal', 'masoor', 'toor', 'moong', 'urad'],
        egg: ['egg', 'ande', 'eggs'],
        spice: ['spice', 'masala', 'turmeric', 'chili', 'cumin', 'coriander']
      };

      // Check all valid ingredients, not just first one
      for (const ingredient of validIngredients) {
        const ingredientLower = ingredient.toLowerCase();
        for (const [key, keywords] of Object.entries(ingredientMap)) {
          if (keywords.some(keyword => ingredientLower.includes(keyword))) {
            theme = key;
            break;
          }
        }
        if (theme !== 'default') break;
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
      setRecipeBackground(generatedRecipe.backgroundImage);
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
            backgroundImage: `url(${recipeBackground || ingredientThemes[backgroundTheme].image})`,
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
               <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-serif">
                 Khana Khazana by Neetesh
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
                <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
                  {isHindi ? recipe.titleHindi : recipe.title}
                </h2>
                <motion.div
                  className="h-0.5 bg-white/30 mt-2"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex gap-2 ml-auto">
                <motion.button
                  onClick={() => window.print()}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300 print:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Print Recipe"
                >
                  <Printer className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: recipe.title,
                        text: `Check out this recipe: ${recipe.title}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300 print:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share Recipe"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
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

        {/* Premium Footer */}
        <motion.footer
          className="mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12">
            {/* Copyright Section */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Copyright className="w-5 h-5 text-white/80" />
                <span className="text-white font-light tracking-wide">
                  Crafted with passion by Neetesh Jatav
                </span>
                <span className="text-white/60 font-light">2025</span>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="relative mb-10"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.div>

            {/* Contact Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              {/* Email 1 */}
              <motion.a
                href="mailto:neeteshjatav11@gmail.com"
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm mb-1">Primary Email</p>
                    <p className="text-white font-mono text-sm">neeteshjatav11@gmail.com</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ x: -100 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.a>

              {/* Email 2 */}
              <motion.a
                href="mailto:neeteshjatav19@gmail.com"
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm mb-1">Alternate Email</p>
                    <p className="text-white font-mono text-sm">neeteshjatav19@gmail.com</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ x: -100 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/918103054195"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm mb-1">Instant Connect</p>
                    <p className="text-white font-mono text-sm">+91 81030 54195</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ x: -100 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.a>
            </motion.div>

            {/* Bottom decoration */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-sm">Available for freelance projects</span>
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}
