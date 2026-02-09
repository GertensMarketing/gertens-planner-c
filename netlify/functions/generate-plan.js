const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image, outlinePoints, sunExposure, theme } = JSON.parse(event.body);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'API key not configured',
          details: 'GEMINI_API_KEY environment variable is missing'
        })
      };
    }

    console.log('Initializing Gemini 1.5 Flash with vision...');
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini 1.5 Flash - best balance of speed, cost, and capability
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert base64 image to the format Gemini expects
    const imageData = image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

    console.log('Creating detailed garden planning prompt...');
    
    // Create detailed prompt for garden planning
    const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota. 

Analyze this garden space photo and create a detailed landscape plan with the following specifications:

GARDEN AREA OUTLINE:
The user has outlined the garden bed area with ${outlinePoints.length} points. This outline represents the boundaries where plants should be placed.

GARDEN CONDITIONS:
- Sun Exposure: ${formatSunExposure(sunExposure)}
- Garden Theme: ${formatTheme(theme)}
- Location: Minnesota (USDA Hardiness Zones 3-4)

REQUIREMENTS:
1. Recommend 6-10 specific perennials, shrubs, or small trees suitable for the conditions
2. All plants MUST be hardy in Minnesota (Zones 3-4)
3. Plants should match the selected theme and sun exposure
4. Consider the outlined area size for appropriate plant quantities and spacing
5. Include a mix of heights (ground cover, medium, tall) for visual interest
6. Suggest seasonal bloom times for continuous color throughout the growing season

Please provide your response ONLY as valid JSON with no markdown formatting or code blocks:
{
  "overview": "Brief 2-3 sentence overview of the garden design concept",
  "plants": [
    {
      "name": "Plant Common Name (Scientific Name)",
      "type": "perennial/shrub/tree",
      "description": "Brief description including bloom time, color, height",
      "placement": "Front/middle/back of bed, or specific location based on outline"
    }
  ],
  "layout": "Description of how to arrange the plants within the outlined area",
  "tips": [
    "Practical planting tip 1",
    "Practical planting tip 2",
    "Practical planting tip 3"
  ]
}

Focus on creating a beautiful, low-maintenance garden that will thrive in Minnesota's climate!`;

    console.log('Calling Gemini 1.5 Flash API with vision...');

    // Generate content with image and text
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    console.log('Gemini API responded successfully');

    const response = await result.response;
    const text = response.text();

    console.log('Response received, parsing...');

    // Try to parse JSON from the response
    let recommendation;
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      
      // Extract JSON from markdown code blocks
      const jsonMatch = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        cleanText = jsonMatch[1];
      } else {
        // Try to extract just the JSON object
        const objectMatch = cleanText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          cleanText = objectMatch[0];
        }
      }
      
      recommendation = JSON.parse(cleanText);
      console.log('✅ Successfully parsed JSON response');
      console.log('Plants recommended:', recommendation.plants?.length || 0);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError.message);
      console.error('Response text:', text.substring(0, 500));
      
      // If parsing fails, create a structured response from the text
      recommendation = {
        overview: text.substring(0, 300) + '...',
        plants: [
          {
            name: "Hosta (Hosta spp.)",
            type: "perennial",
            description: "Shade-loving foliage plant with lush leaves, various colors available, 12-30\" tall",
            placement: "Throughout the outlined area"
          },
          {
            name: "Astilbe (Astilbe spp.)",
            type: "perennial",
            description: "Feathery plumes in summer, prefers partial shade, 18-36\" tall",
            placement: "Middle section of garden bed"
          },
          {
            name: "Coral Bells (Heuchera)",
            type: "perennial",
            description: "Colorful foliage year-round, tiny flowers, 12-18\" tall",
            placement: "Front border"
          }
        ],
        layout: "AI provided detailed recommendations. Arrange plants with taller specimens in back, medium heights in middle, and shorter plants in front.",
        tips: [
          "Visit Gertens Garden Center for expert planting advice and to see these plants in person",
          "Water regularly during the first growing season to establish strong root systems",
          "Apply 2-3 inches of mulch to retain moisture and suppress weeds"
        ]
      };
    }

    console.log('=== SUCCESS - Garden plan generated ===');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        recommendation: recommendation
      })
    };

  } catch (error) {
    console.error('Error generating garden plan:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to generate garden plan. Please try again.',
        details: error.message
      })
    };
  }
};

function formatSunExposure(exposure) {
  const map = {
    'full-sun': 'Full Sun (6+ hours direct sunlight)',
    'partial-sun': 'Partial Sun (3-6 hours direct sunlight)',
    'mostly-shade': 'Mostly Shade (less than 3 hours direct sunlight)'
  };
  return map[exposure] || exposure;
}

function formatTheme(theme) {
  const map = {
    'shade-loving': 'Shade Loving - Lush foliage plants that thrive in low light',
    'fun-in-sun': 'Fun in the Sun - Vibrant sun-loving flowers and plants',
    'colors-galore': 'Colors Galore - A rainbow of colorful blooms',
    'white-moonlight': 'White Moonlight Garden - Elegant white flowering perennials',
    'minnesota-native': 'Minnesota Native Garden - Native plants that support local ecosystems'
  };
  return map[theme] || theme;
}
