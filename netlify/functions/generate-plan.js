const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image, outlinePoints, sunExposure, theme } = JSON.parse(event.body);

    console.log('=== REQUEST INFO ===');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('Conditions:', { sunExposure, theme, points: outlinePoints.length });

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set');
    }

    // Try text-only model first (most compatible)
    console.log('Attempting text-only approach with gemini-pro...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a detailed text-only prompt (no image)
    const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota.

Create a garden plan for these conditions:
- Sun Exposure: ${formatSunExposure(sunExposure)}
- Garden Theme: ${formatTheme(theme)}
- Garden Bed: User has outlined a ${outlinePoints.length}-point area
- Location: Minnesota (USDA Hardiness Zones 3-4)

Recommend 6-8 specific Minnesota-hardy plants (perennials, shrubs, or trees) that match these conditions.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "overview": "Brief 2-3 sentence garden design summary",
  "plants": [
    {
      "name": "Common Name (Scientific Name)",
      "type": "perennial, shrub, or tree",
      "description": "Bloom time, color, height, special features",
      "placement": "Front, middle, or back of bed"
    }
  ],
  "layout": "How to arrange these plants in the outlined area",
  "tips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}`;

    console.log('Calling Gemini API (text-only mode)...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Response received, length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));

    // Parse JSON response
    let recommendation;
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      cleanText = cleanText.replace(/```json\s*/g, '');
      cleanText = cleanText.replace(/```\s*/g, '');
      cleanText = cleanText.trim();
      
      recommendation = JSON.parse(cleanText);
      console.log('✅ Successfully parsed JSON, plants:', recommendation.plants?.length);
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError.message);
      console.error('Attempted to parse:', text.substring(0, 500));
      throw new Error(`AI returned invalid JSON: ${parseError.message}`);
    }

    console.log('=== SUCCESS ===');

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
        note: 'Generated using text-only AI (image analysis not available with current API key)'
      })
    };

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    console.error('Status:', error.status);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check Netlify function logs'
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
