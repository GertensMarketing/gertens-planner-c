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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const imageGenModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

    const imageData = image.split(',')[1];

    console.log('Step 1: Generating plant recommendations...');
    
    // First, get the plant recommendations
    const planPrompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota. 

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

    const planResult = await model.generateContent([
      planPrompt,
      {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const planResponse = await planResult.response;
    const planText = planResponse.text();

    // Parse plant recommendations
    let recommendation;
    try {
      let cleanText = planText.trim();
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      recommendation = JSON.parse(cleanText);
      console.log('✅ Plant recommendations parsed:', recommendation.plants?.length || 0, 'plants');
    } catch (parseError) {
      console.error('JSON parse failed, using fallback');
      recommendation = createFallbackRecommendation(sunExposure, theme);
    }

    // Generate plant list for visualizations
    const plantList = recommendation.plants.map(p => p.name).join(', ');

    console.log('Step 2: Generating watercolor rendering...');

    // Generate watercolor rendering using the original photo as reference
    const watercolorPrompt = `Create a beautiful watercolor illustration showing this garden space transformed with the following plants: ${plantList}.

Style requirements:
- Watercolor painting style with soft, flowing colors
- Maintain the same viewing angle and framing as the reference photo
- Show the garden in full bloom during summer
- Include these specific plants placed appropriately: ${recommendation.plants.map(p => `${p.name} (${p.placement})`).join('; ')}
- Artistic, dreamy garden aesthetic
- Vibrant colors for flowers, lush greens for foliage
- Professional landscape illustration quality`;

    let watercolorImage = null;
    try {
      const watercolorResult = await imageGenModel.generateContent([
        watercolorPrompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);
      
      const watercolorResponse = await watercolorResult.response;
      // Note: Image generation returns base64 in the response
      watercolorImage = watercolorResponse.text(); // This will contain the base64 image
      console.log('✅ Watercolor rendering generated');
    } catch (imgError) {
      console.error('Watercolor generation failed:', imgError.message);
      watercolorImage = null;
    }

    console.log('Step 3: Generating bird\'s eye planting diagram...');

    // Generate bird's eye view planting diagram
    const birdEyePrompt = `Create a black and white bird's eye view planting diagram showing the exact placement and spacing of plants.

Requirements:
- Top-down view (bird's eye perspective)
- Black ink on white paper style, like an architectural drawing
- Show the garden bed outline matching these coordinates: ${JSON.stringify(outlinePoints)}
- Draw circles or shapes representing each plant with their names labeled
- Include spacing measurements between plants (in feet)
- Show plant placement: ${recommendation.plants.map(p => `${p.name} at ${p.placement}`).join('; ')}
- Professional landscape architecture diagram style
- Clear, readable labels for each plant
- Include a simple scale reference
- Show the outline boundary clearly

Style: Technical drawing, clean lines, architectural planting plan.`;

    let birdEyeImage = null;
    try {
      const birdEyeResult = await model.generateContent(birdEyePrompt);
      const birdEyeResponse = await birdEyeResult.response;
      birdEyeImage = birdEyeResponse.text();
      console.log('✅ Bird\'s eye diagram generated');
    } catch (imgError) {
      console.error('Bird\'s eye generation failed:', imgError.message);
      birdEyeImage = null;
    }

    console.log('=== SUCCESS - All assets generated ===');

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
        visualizations: {
          watercolor: watercolorImage,
          birdEye: birdEyeImage,
          note: 'Watercolor shows transformed garden in same angle. Bird\'s eye shows planting layout and spacing.'
        }
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

function createFallbackRecommendation(sunExposure, theme) {
  return {
    overview: "A beautiful Minnesota garden designed for your conditions.",
    plants: [
      {
        name: "Black-Eyed Susan (Rudbeckia fulgida)",
        type: "perennial",
        description: "Golden yellow flowers July-September, 24-36\" tall",
        placement: "Middle and back"
      },
      {
        name: "Purple Coneflower (Echinacea purpurea)",
        type: "perennial",
        description: "Purple-pink flowers, 24-36\" tall",
        placement: "Middle section"
      },
      {
        name: "Hosta 'Sum and Substance'",
        type: "perennial",
        description: "Large chartreuse leaves, 24-30\" tall",
        placement: "Back of bed"
      }
    ],
    layout: "Arrange with taller plants in back, medium in middle, shorter in front.",
    tips: [
      "Visit Gertens for expert advice",
      "Water regularly during establishment",
      "Apply mulch to retain moisture"
    ]
  };
}

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
