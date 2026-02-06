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
          error: 'API key not configured.',
          details: 'GEMINI_API_KEY environment variable is missing'
        })
      };
    }

    console.log('Initializing Gemini API...');
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-pro-vision for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Convert base64 image to the format Gemini expects
    const imageData = image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

    console.log('Creating prompt...');
    
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

    console.log('Calling Gemini API...');

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

    console.log('Gemini API responded');

    const response = await result.response;
    const text = response.text();

    console.log('Parsing response...');

    // Try to parse JSON from the response
    let recommendation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        recommendation = JSON.parse(jsonStr);
      } else {
        recommendation = JSON.parse(text);
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback');
      // Create structured fallback based on conditions
      recommendation = createFallbackRecommendation(sunExposure, theme);
    }

    console.log('Success!');

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
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to generate plan.',
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
    'shade-loving': 'Shade Loving - Lush foliage plants',
    'fun-in-sun': 'Fun in the Sun - Vibrant sun-loving flowers',
    'colors-galore': 'Colors Galore - Rainbow of blooms',
    'white-moonlight': 'White Moonlight - White flowering perennials',
    'minnesota-native': 'Minnesota Native - Native plants'
  };
  return map[theme] || theme;
}

function createFallbackRecommendation(sunExposure, theme) {
  const isShade = sunExposure === 'mostly-shade' || theme === 'shade-loving';
  const isSun = sunExposure === 'full-sun' || theme === 'fun-in-sun';
  const isWhite = theme === 'white-moonlight';
  const isNative = theme === 'minnesota-native';
  
  let plants = [];
  
  if (isShade) {
    plants = [
      { name: "Hosta 'Sum and Substance'", type: "perennial", description: "Large chartreuse leaves, lavender blooms in summer, 24-30\" tall", placement: "Back of bed" },
      { name: "Astilbe 'Bridal Veil'", type: "perennial", description: "White feathery plumes in July, shade-loving, 24\" tall", placement: "Middle section" },
      { name: "Coral Bells 'Palace Purple'", type: "perennial", description: "Deep purple foliage year-round, 12\" tall", placement: "Front border" },
      { name: "Japanese Painted Fern", type: "perennial", description: "Silver and burgundy fronds, 12-18\" tall", placement: "Front and middle" },
      { name: "Bleeding Heart", type: "perennial", description: "Pink heart-shaped flowers in spring, 24\" tall", placement: "Middle section" }
    ];
  } else if (isSun) {
    plants = [
      { name: "Black-Eyed Susan", type: "perennial", description: "Bright yellow flowers July-Sept, 24-36\" tall", placement: "Back section" },
      { name: "Purple Coneflower", type: "perennial", description: "Purple-pink flowers, attracts butterflies, 24-36\" tall", placement: "Middle" },
      { name: "Russian Sage", type: "perennial", description: "Lavender-blue flowers, silvery foliage, 36-48\" tall", placement: "Back" },
      { name: "Daylily 'Stella de Oro'", type: "perennial", description: "Golden yellow blooms all summer, 12\" tall", placement: "Front" },
      { name: "Salvia 'May Night'", type: "perennial", description: "Deep purple flower spikes, 18-24\" tall", placement: "Middle" }
    ];
  } else {
    plants = [
      { name: "Coral Bells", type: "perennial", description: "Colorful foliage, delicate flowers, 12-18\" tall", placement: "Front" },
      { name: "Astilbe", type: "perennial", description: "Feathery plumes in various colors, 24\" tall", placement: "Middle" },
      { name: "Hosta", type: "perennial", description: "Lush foliage in multiple varieties, 12-24\" tall", placement: "Throughout" },
      { name: "Spirea 'Goldflame'", type: "shrub", description: "Golden foliage with pink blooms, 24-36\" tall", placement: "Back" },
      { name: "Daylily", type: "perennial", description: "Various colors available, low-maintenance, 18-24\" tall", placement: "Middle" }
    ];
  }
  
  return {
    overview: `A beautiful Minnesota-hardy garden designed for ${formatSunExposure(sunExposure).toLowerCase()} conditions with a ${formatTheme(theme)} theme. This plan features a mix of heights and textures for year-round interest.`,
    plants: plants,
    layout: "Arrange taller plants (24\"+ tall) toward the back of the bed, medium heights (12-24\") in the middle, and shorter specimens (under 12\") along the front edge. Group plants in odd numbers (3, 5, 7) for a natural look.",
    tips: [
      "Visit Gertens Garden Center to see these plants and get expert advice from our nursery professionals",
      "Plant in spring or fall for best establishment. Water regularly during the first growing season",
      "Apply 2-3 inches of mulch around plants to retain moisture and suppress weeds",
      "All recommended plants are Minnesota-hardy and proven performers in Zones 3-4"
    ]
  };
}
