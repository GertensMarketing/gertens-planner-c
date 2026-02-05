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

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert base64 image to the format Gemini expects
    const imageData = image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

    // Create detailed prompt for garden planning
    const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota. 

Analyze this garden space photo and create a detailed landscape plan with the following specifications:

GARDEN AREA OUTLINE:
The user has outlined the garden bed area with these points: ${JSON.stringify(outlinePoints)}
This outline represents the boundaries where plants should be placed.

GARDEN CONDITIONS:
- Sun Exposure: ${formatSunExposure(sunExposure)}
- Garden Theme: ${formatTheme(theme)}
- Location: Minnesota (USDA Hardiness Zones 3-4)

REQUIREMENTS:
1. Recommend 6-10 specific perennials, shrubs, or small trees suitable for the conditions
2. All plants MUST be hardy in Minnesota (Zones 3-4)
3. Plants should match the selected theme
4. Consider the outlined area size for appropriate plant quantities and spacing
5. Include a mix of heights (ground cover, medium, tall) for visual interest
6. Suggest seasonal bloom times for continuous color

Please provide your response in the following JSON format:
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

    // Generate content with image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let recommendation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        recommendation = JSON.parse(text);
      }
    } catch (parseError) {
      // If parsing fails, create a structured response from the text
      recommendation = {
        overview: text.substring(0, 300),
        plants: [],
        layout: text,
        tips: ["Visit Gertens for expert planting advice", "Water regularly during establishment", "Mulch to retain moisture"]
      };
    }

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
