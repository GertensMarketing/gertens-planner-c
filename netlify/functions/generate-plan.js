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

    console.log('=== DEBUGGING INFO ===');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('Sun exposure:', sunExposure);
    console.log('Theme:', theme);
    console.log('Outline points:', outlinePoints.length);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    console.log('Initializing Gemini API...');
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try the correct model names in order
    const modelNames = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    
    let model = null;
    let usedModel = null;
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        usedModel = modelName;
        console.log(`Successfully initialized model: ${modelName}`);
        break;
      } catch (err) {
        console.log(`Model ${modelName} failed:`, err.message);
      }
    }
    
    if (!model) {
      throw new Error('Could not initialize any Gemini model');
    }

    // Convert base64 image to the format Gemini expects
    const imageData = image.split(',')[1];
    console.log('Image data prepared, length:', imageData.length);

    // Create detailed prompt for garden planning
    const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota. 

Analyze this garden space photo and create a detailed landscape plan.

GARDEN AREA: The user has outlined the planting area with ${outlinePoints.length} points.

CONDITIONS:
- Sun Exposure: ${formatSunExposure(sunExposure)}
- Garden Theme: ${formatTheme(theme)}
- Location: Minnesota (USDA Zones 3-4)

Please recommend 6-8 specific plants (perennials, shrubs, or small trees) that:
1. Are hardy in Minnesota (Zones 3-4)
2. Match the sun exposure and theme
3. Provide varied heights and seasonal interest
4. Are low-maintenance

IMPORTANT: Provide your response as valid JSON only, with no markdown formatting:
{
  "overview": "2-3 sentence garden design summary",
  "plants": [
    {
      "name": "Common Name (Scientific Name)",
      "type": "perennial/shrub/tree",
      "description": "Features, bloom time, height",
      "placement": "Front/middle/back"
    }
  ],
  "layout": "How to arrange these plants",
  "tips": ["tip1", "tip2", "tip3"]
}`;

    console.log('Calling Gemini API with model:', usedModel);

    // Generate content with image
    const result = await model.generateContent([
      {
        text: prompt
      },
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    console.log('Gemini API call completed successfully');

    const response = await result.response;
    const text = response.text();

    console.log('Response received, length:', text.length);
    console.log('Response preview:', text.substring(0, 300));

    // Try to parse JSON from the response
    let recommendation;
    
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        console.log('Found JSON match, parsing...');
        recommendation = JSON.parse(jsonStr);
        console.log('JSON parsed successfully, plants count:', recommendation.plants?.length);
      } else {
        console.log('No JSON pattern found, trying direct parse...');
        recommendation = JSON.parse(text);
        console.log('Direct parse successful');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError.message);
      console.error('Attempted to parse:', text.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    console.log('=== SUCCESS ===');
    console.log('Recommendation created with', recommendation.plants?.length, 'plants');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        recommendation: recommendation,
        modelUsed: usedModel
      })
    };

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error statusText:', error.statusText);
    console.error('Stack trace:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        errorType: error.name,
        status: error.status,
        details: 'Check Netlify function logs for full details'
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
    'shade-loving': 'Shade Loving - Lush foliage plants',
    'fun-in-sun': 'Fun in the Sun - Vibrant sun-loving flowers',
    'colors-galore': 'Colors Galore - Rainbow of blooms',
    'white-moonlight': 'White Moonlight Garden - White flowering perennials',
    'minnesota-native': 'Minnesota Native Garden - Native plants'
  };
  return map[theme] || theme;
}
