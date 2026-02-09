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

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set');
    }

    console.log('Initializing Gemini 2.5 Flash...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini 2.5 Flash - the latest and greatest!
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageData = image.split(',')[1];

    console.log('Creating garden planning prompt...');
    
    const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota. 

Analyze this garden space photo and create a detailed landscape plan.

GARDEN AREA: The user has outlined ${outlinePoints.length} points marking the planting area.

CONDITIONS:
- Sun Exposure: ${formatSunExposure(sunExposure)}
- Garden Theme: ${formatTheme(theme)}
- Location: Minnesota (USDA Hardiness Zones 3-4)

Recommend 6-10 specific plants (perennials, shrubs, or small trees) that:
1. Are hardy in Minnesota (Zones 3-4)
2. Match the sun exposure and theme
3. Provide varied heights and seasonal interest
4. Are low-maintenance and proven performers

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "overview": "2-3 sentence garden design summary",
  "plants": [
    {
      "name": "Common Name (Scientific Name)",
      "type": "perennial/shrub/tree",
      "description": "Features, bloom time, color, height",
      "placement": "Front/middle/back of bed"
    }
  ],
  "layout": "How to arrange these plants in the outlined area",
  "tips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}`;

    console.log('Calling Gemini 2.5 Flash API...');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    console.log('✅ API call successful');

    const response = await result.response;
    const text = response.text();

    console.log('Parsing response...');

    // Parse JSON from response
    let recommendation;
    try {
      let cleanText = text.trim();
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\s*/g, '');
      cleanText = cleanText.replace(/```\s*/g, '');
      cleanText = cleanText.trim();
      
      // Extract JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      recommendation = JSON.parse(cleanText);
      console.log('✅ JSON parsed successfully');
      console.log('Plants recommended:', recommendation.plants?.length || 0);
    } catch (parseError) {
      console.error('JSON parse failed:', parseError.message);
      
      // Fallback response
      recommendation = {
        overview: "A beautiful Minnesota garden design based on your selections. " + text.substring(0, 200),
        plants: [
          {
            name: "Black-Eyed Susan (Rudbeckia fulgida)",
            type: "perennial",
            description: "Golden yellow flowers July-September, 24-36\" tall, drought tolerant",
            placement: "Middle and back of bed"
          },
          {
            name: "Purple Coneflower (Echinacea purpurea)",
            type: "perennial",
            description: "Purple-pink flowers, attracts butterflies, 24-36\" tall",
            placement: "Middle section"
          },
          {
            name: "Hosta 'Sum and Substance'",
            type: "perennial",
            description: "Large chartreuse leaves, lavender blooms, 24-30\" tall",
            placement: "Shaded areas or back"
          }
        ],
        layout: "Arrange plants with taller specimens toward the back, medium heights in middle, and shorter plants in front for best visual impact.",
        tips: [
          "Visit Gertens Garden Center for expert advice and to see these plants",
          "Water regularly during first growing season",
          "Apply 2-3 inches of mulch to retain moisture"
        ]
      };
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
        recommendation: recommendation
      })
    };

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check Netlify function logs for details'
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
