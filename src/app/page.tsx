'use client';

import { useState, useRef, useEffect } from 'react';
import { ChefHat, Clock, Users, Plus, X, Sparkles, Utensils, Flame, Mail, MessageCircle, Copyright, Share2, Printer, Shuffle, Volume2, VolumeX, Moon, Sun, Heart, History, Timer, ShoppingCart, Star, ChevronDown, ChevronUp, Download, BarChart3, MessageSquare, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Recipe {
  id: string;
  title: string;
  titleHindi: string;
  ingredients: string[];
  ingredientsHindi: string[];
  instructions: string[];
  instructionsHindi: string[];
  prepTime: string;
  prepTimeHindi: string;
  servings: number;
  isVeg: boolean;
  difficulty?: string;
  difficultyHindi?: string;
  nutrition?: NutritionInfo;
  timestamp?: number;
  notes?: string;
  rating?: number;
}

interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHindi, setIsHindi] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [adjustedServings, setAdjustedServings] = useState<number>(1);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [recipeNotes, setRecipeNotes] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [showNutrition, setShowNutrition] = useState(false);
  const [stepByStepMode, setStepByStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVeg, setIsVeg] = useState<boolean | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (isReading) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isReading]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipe-favorites');
    const savedHistory = localStorage.getItem('recipe-history');
    const savedVegMode = localStorage.getItem('vegMode');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedVegMode === 'true') setIsVeg(true);
    else if (savedVegMode === 'false') setIsVeg(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('recipe-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recipe-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (recipe) {
      setAdjustedServings(recipe.servings);
    }
  }, [recipe]);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const randomIngredients = [
    'chicken', 'tomatoes', 'onion', 'garlic', 'ginger', 'rice', 'potatoes', 'paneer',
    'lentils', 'cumin', 'turmeric', 'coriander', 'chili powder', 'garam masala', 'curry leaves',
    'coconut milk', 'yogurt', 'spinach', 'cauliflower', 'peas', 'carrots', 'beans'
  ];

  const hapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const successHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  const errorHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const toggleTheme = () => {
    hapticFeedback();
    setIsDark(!isDark);
  };

  const speakRecipe = () => {
    hapticFeedback();
    if (!recipe) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const title = isHindi ? recipe.titleHindi : recipe.title;
    const ingredients = (isHindi ? recipe.ingredientsHindi : recipe.ingredients).join(', ');
    const instructions = (isHindi ? recipe.instructionsHindi : recipe.instructions).join(' ');
    const prepTime = isHindi ? recipe.prepTimeHindi : recipe.prepTime;

    const text = `${title}. Cooking time: ${prepTime}. Ingredients: ${ingredients}. Instructions: ${instructions}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredLang = isHindi ? 'hi-IN' : 'en-IN';

    let indianVoice = voices.find(voice =>
      voice.lang.toLowerCase().includes('hi-in') ||
      voice.lang.toLowerCase().includes('en-in')
    );

    if (!indianVoice) {
      indianVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('indian') ||
        voice.name.toLowerCase().includes('hindi')
      );
    }

    if (!indianVoice) {
      indianVoice = voices.find(voice =>
        voice.lang.startsWith('hi') ||
        voice.lang.startsWith('en-IN') ||
        voice.lang.startsWith('en_GB')
      );
    }

    if (indianVoice) {
      utterance.voice = indianVoice;
      utterance.lang = indianVoice.lang;
    } else if (isHindi) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => {
      setIsReading(false);
    };

    utterance.onerror = () => {
      setIsReading(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const addIngredient = () => {
    hapticFeedback();
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    hapticFeedback();
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const generateRecipe = async () => {
    hapticFeedback();
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');

    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient');
      errorHaptic();
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
      const recipeWithId = { ...generatedRecipe, id: Date.now().toString() };
      setRecipe(recipeWithId);
      addToHistory(recipeWithId);
      successHaptic();
    } catch {
      setError('Failed to generate recipe. Please try again.');
      errorHaptic();
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    hapticFeedback();
    if (!recipe) return;

    const isFavorite = favorites.some(fav => fav.id === recipe.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const addToHistory = (newRecipe: Recipe) => {
    const recipeWithId = { ...newRecipe, id: Date.now().toString(), timestamp: Date.now() };
    setHistory([recipeWithId, ...history].slice(0, 10));
  };

  const loadRecipeFromHistory = (recipeItem: Recipe) => {
    hapticFeedback();
    setRecipe(recipeItem);
    setAdjustedServings(recipeItem.servings);
    setCurrentRating(recipeItem.rating || 0);
    setRecipeNotes(recipeItem.notes || '');
    setShowHistory(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    hapticFeedback();
    if (timerRunning) {
      if (timerInterval) clearInterval(timerInterval);
      setTimerRunning(false);
      setTimerInterval(null);
    } else {
      const interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      setTimerRunning(true);
    }
  };

  const resetTimer = () => {
    hapticFeedback();
    if (timerInterval) clearInterval(timerInterval);
    setTimerSeconds(0);
    setTimerRunning(false);
    setTimerInterval(null);
  };

  const getShoppingList = () => {
    if (!recipe) return [];
    return (isHindi ? recipe.ingredientsHindi : recipe.ingredients).map(item => item);
  };

  const adjustIngredients = (originalServings: number, newServings: number) => {
    if (!recipe) return [];
    const factor = newServings / originalServings;
    const ingredients = isHindi ? recipe.ingredientsHindi : recipe.ingredients;
    return ingredients.map(ing => {
      const match = ing.match(/^([\d/]+)\s*(.+)/);
      if (match) {
        const [, amount, rest] = match;
        const numAmount = eval(amount);
        const newAmount = Math.round(numAmount * factor * 10) / 10;
        return `${newAmount} ${rest}`;
      }
      return ing;
    });
  };

  const deleteFromHistory = (recipeId: string) => {
    hapticFeedback();
    setHistory(history.filter(item => item.id !== recipeId));
  };

  const saveRecipeNotes = () => {
    if (!recipe || !recipeNotes.trim()) return;
    hapticFeedback();
    const updatedRecipe = { ...recipe, notes: recipeNotes };
    const updatedFavorites = favorites.map(fav =>
      fav.id === recipe.id ? updatedRecipe : fav
    );
    const updatedHistory = history.map(h =>
      h.id === recipe.id ? updatedRecipe : h
    );
    setFavorites(updatedFavorites);
    setHistory(updatedHistory);
    setShowNotes(false);
  };

  const rateRecipe = (rating: number) => {
    if (!recipe) return;
    hapticFeedback();
    const updatedRecipe = { ...recipe, rating };
    const updatedFavorites = favorites.map(fav =>
      fav.id === recipe.id ? updatedRecipe : fav
    );
    const updatedHistory = history.map(h =>
      h.id === recipe.id ? updatedRecipe : h
    );
    setFavorites(updatedFavorites);
    setHistory(updatedHistory);
    setCurrentRating(rating);
    successHaptic();
  };

  const calculateNutrition = () => {
    if (!recipe) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const ingredients = isHindi ? recipe.ingredientsHindi : recipe.ingredients;
    let calories = 0, protein = 0, carbs = 0, fat = 0;

    ingredients.forEach(ing => {
      const match = ing.match(/^([\d/]+)\s*(.+)/);
      if (match) {
        const [, amountStr, item] = match;
        const amount = eval(amountStr);

        const itemLower = item.toLowerCase();

        if (itemLower.includes('chicken')) {
          calories += amount * 165;
          protein += amount * 31;
          fat += amount * 3.6;
        } else if (itemLower.includes('paneer') || itemLower.includes('cottage cheese')) {
          calories += amount * 265;
          protein += amount * 18;
          fat += amount * 20;
        } else if (itemLower.includes('rice')) {
          calories += amount * 130;
          carbs += amount * 28;
          protein += amount * 2.7;
        } else if (itemLower.includes('lentil') || itemLower.includes('dal')) {
          calories += amount * 116;
          protein += amount * 9;
          carbs += amount * 20;
        } else if (itemLower.includes('tomato')) {
          calories += amount * 18;
          carbs += amount * 3.9;
        } else if (itemLower.includes('onion')) {
          calories += amount * 40;
          carbs += amount * 9.3;
        } else if (itemLower.includes('potato')) {
          calories += amount * 77;
          carbs += amount * 17;
        }
      }
    });

    return {
      calories: Math.round(calories * adjustedServings / recipe.servings),
      protein: Math.round(protein * adjustedServings / recipe.servings),
      carbs: Math.round(carbs * adjustedServings / recipe.servings),
      fat: Math.round(fat * adjustedServings / recipe.servings)
    };
  };

  const feelingLucky = async () => {
    hapticFeedback();
    const randomCount = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...randomIngredients].sort(() => 0.5 - Math.random());
    const selectedIngredients = shuffled.slice(0, randomCount);

    setIngredients(selectedIngredients);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const generatedRecipe = await response.json();
      const recipeWithId = { ...generatedRecipe, id: Date.now().toString() };
      setRecipe(recipeWithId);
      addToHistory(recipeWithId);
      successHaptic();
    } catch {
      setError('Failed to generate recipe. Please try again.');
      errorHaptic();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-4 sm:py-8 px-3 sm:px-4 lg:px-8 transition-colors duration-500 ${
      isVeg === true
        ? 'bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950'
        : isVeg === false
          ? 'bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-950'
          : 'bg-gradient-to-b from-orange-50 to-white dark:from-orange-950 dark:to-gray-950'
    }`}>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Khana Khazana by Neetesh
              </h1>
              <div className={`h-1 bg-gradient-to-r from-transparent to-transparent mt-3 sm:mt-4 rounded-full ${
                isVeg === true ? 'via-green-500 dark:via-green-400' :
                isVeg === false ? 'via-red-500 dark:via-red-400' :
                'via-orange-500 dark:via-orange-400'
              }`} />
            </CardContent>
          </Card>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {isHindi ? 'बताइए आपके पास कौन सी सामग्री है, हम आपके लिए एक स्वादिष्ट भारतीय व्यंजन बनाएंगे!' : 'Tell us what ingredients you have, and we\'ll create a delicious Indian recipe for you!'}
          </p>
          <Button
            onClick={() => {
              hapticFeedback();
              setIsHindi(!isHindi);
            }}
            variant="outline"
            size="sm"
          >
            {isHindi ? '🇬🇧 English' : '🇮🇳 हिंदी'}
          </Button>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                isVeg === true ? 'bg-green-100' :
                isVeg === false ? 'bg-red-100' :
                'bg-orange-100'
              }`}>
                <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isVeg === true ? 'text-green-600' :
                  isVeg === false ? 'text-red-600' :
                  'text-orange-600'
                }`} />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {isHindi ? 'आपकी सामग्री' : 'Your Ingredients'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
            <div className="space-y-2 sm:space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={isHindi ? "जैसे: मुर्गी, टमाटर, लहसुन" : "e.g., chicken, tomatoes, garlic"}
                    className="text-sm"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      onClick={() => removeIngredient(index)}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  hapticFeedback();
                  setIsVeg(true);
                  localStorage.setItem('vegMode', 'true');
                }}
                variant={isVeg === true ? "default" : "outline"}
                size="sm"
                className={isVeg === true ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2 border-2 border-green-600" />
                {isHindi ? 'शाकाहारी' : 'Vegetarian'}
              </Button>
              <Button
                onClick={() => {
                  hapticFeedback();
                  setIsVeg(false);
                  localStorage.setItem('vegMode', 'false');
                }}
                variant={isVeg === false ? "default" : "outline"}
                size="sm"
                className={isVeg === false ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 border-2 border-red-600" />
                {isHindi ? 'मांसाहारी' : 'Non-Vegetarian'}
              </Button>
              {isVeg !== null && (
                <Button
                  onClick={() => {
                    hapticFeedback();
                    setIsVeg(null);
                    localStorage.setItem('vegMode', 'null');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={() => {
                  hapticFeedback();
                  if (confirm(isHindi ? 'क्या आप सभी सामग्री साफ़ करना चाहते हैं?' : 'Are you sure you want to clear all ingredients?')) {
                    setIngredients(['']);
                    setRecipe(null);
                    setRecipeNotes('');
                    setCurrentRating(0);
                    setShowShoppingList(false);
                    setShowNotes(false);
                    setShowNutrition(false);
                    setAdjustedServings(1);
                    setTimerSeconds(0);
                    if (timerInterval) clearInterval(timerInterval);
                    setTimerRunning(false);
                    setTimerInterval(null);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 ml-auto"
              >
                {isHindi ? 'साफ़ करें' : 'Reset'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={addIngredient}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isHindi ? 'सामग्री जोड़ें' : 'Add Ingredient'}
              </Button>
              <Button
                onClick={generateRecipe}
                disabled={loading}
                className={`w-full sm:w-auto ${
                  isVeg === true ? 'bg-green-600 hover:bg-green-700' :
                  isVeg === false ? 'bg-red-600 hover:bg-red-700' :
                  ''
                }`}
                size="sm"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    {isHindi ? 'व्यंजन बना रहे हैं...' : 'Generating Recipe...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isHindi ? 'व्यंजन बनाएं' : 'Generate Recipe'}
                  </>
                )}
              </Button>
              <Button
                onClick={feelingLucky}
                disabled={loading}
                variant="outline"
                size="sm"
                className={`w-full sm:w-auto ${
                  isVeg === true ? 'border-green-500 text-green-600 hover:bg-green-50' :
                  isVeg === false ? 'border-red-500 text-red-600 hover:bg-red-50' :
                  'border-orange-500 text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {isHindi ? 'भाग्य आज़माएं' : "I'm Feeling Lucky"}
              </Button>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {recipe && (
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl break-words">
                    {isHindi ? recipe.titleHindi : recipe.title}
                  </CardTitle>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={() => {
                      hapticFeedback();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline"
                    size="icon"
                    title={isHindi ? 'घर जाएं' : 'Go to Home'}
                    className="h-9 w-9 sm:h-10 sm:w-10 print:hidden"
                  >
                    <ChefHat className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={toggleFavorite}
                    variant="outline"
                    size="icon"
                    title={favorites.some(fav => fav.id === recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    className="h-9 w-9 sm:h-10 sm:w-10 print:hidden"
                  >
                    {favorites.some(fav => fav.id === recipe.id) ? <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> : <Star className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={speakRecipe}
                    variant="outline"
                    size="icon"
                    title={isReading ? 'Stop Reading' : 'Read Aloud'}
                    className="h-9 w-9 sm:h-10 sm:w-10 print:hidden"
                  >
                    {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => {
                      hapticFeedback();
                      window.print();
                    }}
                    variant="outline"
                    size="icon"
                    title="Print Recipe"
                    className="h-9 w-9 sm:h-10 sm:w-10 print:hidden"
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      hapticFeedback();
                      if (navigator.share) {
                        navigator.share({
                          title: recipe.title,
                          text: `Check out this recipe: ${recipe.title}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        successHaptic();
                        alert('Link copied to clipboard!');
                      }
                    }}
                    variant="outline"
                    size="icon"
                    title="Share Recipe"
                    className="h-9 w-9 sm:h-10 sm:w-10 print:hidden"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{isHindi ? 'समय:' : 'Cooking Time'}</span>
                  <span className="text-muted-foreground text-sm sm:text-base">{isHindi ? recipe.prepTimeHindi : recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{isHindi ? 'परोस:' : 'Servings'}</span>
                  <span className="text-muted-foreground text-sm sm:text-base">{recipe.servings} {isHindi ? 'लोगों के लिए' : 'people'}</span>
                </div>
              </div>

              <Card className="bg-orange-50 dark:bg-orange-950/30">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{isHindi ? 'समायोजित परोस:' : 'Adjust Servings:'}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            hapticFeedback();
                            setAdjustedServings(Math.max(1, adjustedServings - 1));
                          }}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{adjustedServings}</span>
                        <Button
                          onClick={() => {
                            hapticFeedback();
                            setAdjustedServings(adjustedServings + 1);
                          }}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Timer className="w-5 h-5 text-orange-600" />
                      <span className="font-mono text-lg font-semibold text-orange-600 dark:text-orange-400">
                        {formatTime(timerSeconds)}
                      </span>
                      <Button
                        onClick={startTimer}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                      >
                        {timerRunning ? (isHindi ? 'रोकें' : 'Pause') : (isHindi ? 'शुरू करें' : 'Start')}
                      </Button>
                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        hapticFeedback();
                        setShowShoppingList(!showShoppingList);
                      }}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isHindi ? 'शॉपिंग लिस्ट' : 'Shopping List'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showShoppingList && (
                <Card className="border-orange-300 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-orange-600" />
                      {isHindi ? 'शॉपिंग लिस्ट' : 'Shopping List'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getShoppingList().map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-orange-500"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {isHindi ? 'सामग्री' : 'Ingredients'}
                  </h3>
                </div>
                <Card>
                  <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {(isHindi ? recipe.ingredientsHindi : recipe.ingredients).map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                          <span className="break-words">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {isHindi ? 'बनाने का तरीका' : 'Instructions'}
                  </h3>
                </div>
                <Card>
                  <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <ol className="space-y-3 sm:space-y-4">
                      {(isHindi ? recipe.instructionsHindi : recipe.instructions).map((instruction, index) => (
                        <li key={index} className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-primary-foreground">
                            {index + 1}
                          </div>
                          <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {(history.length > 0 || favorites.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-lg">
                        {isHindi ? 'इतिहास' : 'History'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          hapticFeedback();
                          if (confirm(isHindi ? 'क्या आप सभी इतिहास हटाना चाहते हैं?' : 'Are you sure you want to clear all history?')) {
                            setHistory([]);
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        title={isHindi ? 'इतिहास साफ़ करें' : 'Clear History'}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          hapticFeedback();
                          setShowHistory(!showHistory);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {showHistory && (
                  <CardContent className="space-y-2">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <button
                          onClick={() => loadRecipeFromHistory(item)}
                          className="flex-1 text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors"
                        >
                          <p className="font-medium text-sm">{isHindi ? item.titleHindi : item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.timestamp || Date.now()).toLocaleDateString()}
                          </p>
                        </button>
                        <Button
                          onClick={() => deleteFromHistory(item.id)}
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
                          title={isHindi ? 'हटाएं' : 'Delete'}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}

            {favorites.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-lg">
                        {isHindi ? 'पसंदीदा' : 'Favorites'}
                      </CardTitle>
                    </div>
                    <Button
                      onClick={() => {
                        hapticFeedback();
                        setShowFavorites(!showFavorites);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      {showFavorites ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {showFavorites && (
                  <CardContent className="space-y-2">
                    {favorites.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadRecipeFromHistory(item)}
                        className="w-full text-left p-3 bg-muted rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500 shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{isHindi ? item.titleHindi : item.title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        )}

        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <Badge variant="secondary" className="px-4 py-2 sm:px-6 sm:py-3 text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Copyright className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Crafted with passion by Neetesh</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">2025</span>
                </div>
              </Badge>
            </div>

            <Separator className="mb-6 sm:mb-8" />

            <div className="grid grid-cols-1 gap-3">
              <a href="mailto:neeteshjatav11@gmail.com">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Primary Email</p>
                        <p className="text-xs sm:text-sm font-mono break-all">neeteshjatav11@gmail.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>

              <a href="mailto:neeteshjatav19@gmail.com">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Alternate Email</p>
                        <p className="text-xs sm:text-sm font-mono break-all">neeteshjatav19@gmail.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>

              <a href="https://wa.me/918103054195" target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Instant Connect</p>
                        <p className="text-xs sm:text-sm font-mono">+91 81030 54195</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Badge variant="outline" className="px-4 py-2 sm:px-6 sm:py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm">Available for freelance projects</span>
                </div>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
