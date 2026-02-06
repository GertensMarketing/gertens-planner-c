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
    console.log('API Key starts with AIza:', process.env.GEMINI_API_KEY?.startsWith('AIza'));
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length);
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
    
    console.log('Getting model: gemini-pro-vision');
    
    // Use gemini-pro-vision for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    console.log('Model initialized successfully');

    // Convert base64 image to the format Gemini expects
    const imageData = image.split(',')[1];
    console.log('Image data length:', imageData.length);

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

Provide your response as JSON:
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

    console.log('Prompt created, calling Gemini API...');

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

    console.log('Gemini API call completed');

    const response = await result.response;
    const text = response.text();

    console.log('Response received, length:', text.length);
    console.log('Response preview:', text.substring(0, 200));

    // Try to parse JSON from the response
    let recommendation;
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      console.log('Found JSON match, parsing...');
      recommendation = JSON.parse(jsonStr);
      console.log('JSON parsed successfully, plants count:', recommendation.plants?.length);
    } else {
      console.log('No JSON found in response, trying direct parse...');
      recommendation = JSON.parse(text);
      console.log('Direct parse successful');
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
        recommendation: recommendation
      })
    };

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error statusText:', error.statusText);
    console.error('Full error:', JSON.stringify(error, null, 2));
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
