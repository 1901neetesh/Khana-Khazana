import { NextRequest, NextResponse } from 'next/server';

interface RecipeRequest {
  ingredients: string[];
}

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: number;
}

function generateMockRecipe(ingredients: string[]): Recipe {
  const ingredientList = ingredients.join(', ');
  
  const recipes = [
    {
      title: `Delicious ${ingredients[0]} Curry`,
      titleHindi: `${ingredients[0]} की स्वादिष्ट करी`,
      ingredients: [
        ...ingredients,
        '2 tbsp ghee',
        '1 onion, chopped',
        '2 garlic cloves, minced',
        '1 inch ginger, grated',
        '2 green chilies, chopped',
        '1/2 tsp turmeric powder',
        '1 tsp red chili powder',
        '1 tsp coriander powder',
        '1 cup tomato puree',
        'Salt to taste',
        'Fresh coriander leaves'
      ],
      ingredientsHindi: [
        ...ingredients,
        '2 टेबलस्पून घी',
        '1 प्याज़, कटा हुआ',
        '2 लहसुन कलियां, कुची हुई',
        '1 इंच अदरक, कद्दूकस किया हुआ',
        '2 हरी मिर्च, कटी हुई',
        '1/2 टीस्पून हल्दी पाउडर',
        '1 टीस्पून लाल मिर्च पाउडर',
        '1 टीस्पून धनिया पाउडर',
        '1 कप टमाटर, प्यूरी',
        'नमक स्वादानुसार',
        'ताज़ा हरा धनिया'
      ],
      instructions: [
        'Heat ghee in a kadai or heavy-bottomed pan.',
        'Add chopped onion and sauté until golden brown.',
        'Add garlic, ginger, and green chilies, sauté for 1 minute.',
        `Add ${ingredients[0]} and cook for 3-4 minutes, stirring occasionally.`,
        ...ingredients.slice(1).map(ing => `Add ${ing} and mix well.`),
        'Add all spices (turmeric, red chili powder, coriander powder) and sauté.',
        'Add tomato puree and cook until oil separates.',
        'Add 1/2 cup water, salt, and cook covered for 10-15 minutes.',
        'Garnish with fresh coriander and serve hot with roti or rice.'
      ],
      instructionsHindi: [
        'एक कड़ाही में घी गर्म करें।',
        'इसमें कटा हुआ प्याज़ डालकर सुनहरा होने तक भूनें।',
        'लहसुन, अदरक और हरी मिर्च डालें और 1 मिनट भूनें।',
        `अब ${ingredients[0]} डालें और 3-4 मिनट पकाएं।`,
        ...ingredients.slice(1).map(ing => `${ing} डालें और अच्छी तरह मिलाएं।`),
        'सभी मसाले डालें और भूनें।',
        'टमाटर प्यूरी डालें और मसाले छोड़ने तक पकाएं।',
        '1/2 कप पानी डालें, नमक डालें और ढककर 10-15 मिनट पकाएं।',
        'गार्निश के लिए हरा धनिया डालें और गर्मा-गर्म रोटी या चावल के साथ परोसें।'
      ],
      prepTime: '25 minutes',
      prepTimeHindi: '25 मिनट',
      servings: 4
    },
    {
      title: `Spicy ${ingredients[0]} Rice`,
      titleHindi: `${ingredients[0]} मसाला भात`,
      ingredients: [
        ...ingredients,
        '2 cups rice, washed',
        '3 tbsp oil',
        '1 onion, finely chopped',
        '2 garlic cloves, minced',
        '1 tsp cumin seeds',
        '2 cardamoms',
        '1 cinnamon stick',
        '2 cloves',
        '1/2 tsp turmeric',
        '1 tsp garam masala',
        'Lemon juice'
      ],
      ingredientsHindi: [
        ...ingredients,
        '2 कप चावल, धुला हुआ',
        '3 टेबलस्पून तेल',
        '1 प्याज़, बारीक कटा हुआ',
        '2 लहसुन कलियां, कुची हुई',
        '1 टीस्पून जीरा',
        '2 इलायची',
        '1 दालचीनी',
        '2 लौंग',
        '1/2 टीस्पून हल्दी',
        '1 टीस्पून गरम मसाला',
        'नींबू का रस'
      ],
      instructions: [
        'Soak rice for 30 minutes, then drain.',
        'Heat oil in a pan, add cumin seeds and let them splutter.',
        'Add whole spices (cardamom, cinnamon, cloves).',
        'Add onion and sauté until golden brown.',
        'Add garlic and sauté for 1 minute.',
        `Add ${ingredients[0]} and cook for 2-3 minutes.`,
        ...ingredients.slice(1).map(ing => `Add ${ing} and mix well.`),
        'Add turmeric and garam masala, mix well.',
        'Add washed rice and 4 cups water.',
        'Add salt, cover and cook on medium heat.',
        'When rice is cooked, add lemon juice and garnish with coriander.'
      ],
      instructionsHindi: [
        'चावल को 30 मिनट पानी में भिगोएं, फिर छान लें।',
        'एक पैन में तेल गर्म करें, जीरा डालें और चमकने दें।',
        'सभी साबुत मसाले डालें।',
        'प्याज़ डालें और सुनहरा होने तक भूनें।',
        'लहसुन डालें और 1 मिनट भूनें।',
        `अब ${ingredients[0]} डालें और 2-3 मिनट पकाएं।`,
        ...ingredients.slice(1).map(ing => `${ing} डालें और मिलाएं।`),
        'हल्दी और गरम मसाला डालें, अच्छी तरह मिलाएं।',
        'धुले हुए चावल डालें और 4 कप पानी डालें।',
        'नमक डालें, ढककर मध्यम आंच पर पकाएं।',
        'जब चावल पक जाएं, नींबू का रस डालें और धनिया से गार्निश करें।'
      ],
      prepTime: '20 minutes',
      prepTimeHindi: '20 मिनट',
      servings: 4
    },
    {
      title: `${ingredients[0]} Dal Tadka`,
      titleHindi: `${ingredients[0]} दाल तड़का`,
      ingredients: [
        ...ingredients,
        '1 cup toor dal',
        '2 tbsp oil',
        '1 onion, chopped',
        '2 tomatoes, chopped',
        '1 tsp cumin seeds',
        '1 tsp mustard seeds',
        'Curry leaves',
        'Green chilies',
        'Garlic, chopped',
        'Turmeric, red chili powder',
        'Coriander powder'
      ],
      ingredientsHindi: [
        ...ingredients,
        '1 कप अरहर दाल',
        '2 टेबलस्पून तेल',
        '1 प्याज़, कटा हुआ',
        '2 टमाटर, कटे हुए',
        '1 टीस्पून जीरा',
        '1 टीस्पून राई',
        'कड़ी पत्ते',
        'हरी मिर्च',
        'लहसुन, कटा हुआ',
        'हल्दी, लाल मिर्च पाउडर',
        'धनिया पाउडर'
      ],
      instructions: [
        'Wash and soak dal for 30 minutes.',
        'Cook dal in pressure cooker with 2 cups water, turmeric, and salt for 2-3 whistles.',
        'Heat oil in a pan, add cumin and mustard seeds.',
        'Add garlic, green chilies, and curry leaves.',
        'Add onion and sauté until golden brown.',
        'Add tomatoes and cook until soft.',
        `Add ${ingredients[0]} and cook for 2-3 minutes.`,
        ...ingredients.slice(1).map(ing => `Add ${ing} and mix well.`),
        'Add all spices and sauté for 1 minute.',
        'Add cooked dal and mix well.',
        'Add water if needed, bring to boil, and simmer for 5 minutes.',
        'Garnish with fresh coriander and serve hot with rice or roti.'
      ],
      instructionsHindi: [
        'दाल को धोकर 30 मिनट भिगोएं।',
        'प्रेशर कुकर में दाल, 2 कप पानी, हल्दी और नमक डालकर 2-3 सीटी आने तक पकाएं।',
        'एक पैन में तेल गर्म करें, जीरा और राई डालें।',
        'लहसुन, हरी मिर्च और कड़ी पत्ते डालें।',
        'प्याज़ डालें और सुनहरा होने तक भूनें।',
        'टमाटर डालें और नरम होने तक पकाएं।',
        `अब ${ingredients[0]} डालें और 2-3 मिनट पकाएं।`,
        ...ingredients.slice(1).map(ing => `${ing} डालें और मिलाएं।`),
        'सभी मसाले डालें और 1 मिनट भूनें।',
        'पकी हुई दाल डालें और अच्छी तरह मिलाएं।',
        'जरूरत के अनुसार पानी डालें, उबालें, और 5 मिनट तक सिम्मर करें।',
        'ताज़ा धनिया डालें और गर्मा-गर्म चावल या रोटी के साथ परोसें।'
      ],
      prepTime: '30 minutes',
      prepTimeHindi: '30 मिनट',
      servings: 4
    }
  ];

  return recipes[Math.floor(Math.random() * recipes.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body: RecipeRequest = await request.json();
    const { ingredients } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient' },
        { status: 400 }
      );
    }

    const recipe = generateMockRecipe(ingredients);
    
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}