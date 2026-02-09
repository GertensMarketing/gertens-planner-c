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

    console.log('=== LISTING AVAILABLE MODELS ===');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list available models
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
      const data = await response.json();
      
      console.log('Available models:');
      if (data.models) {
        data.models.forEach(model => {
          console.log('- Model:', model.name);
          console.log('  Supports:', model.supportedGenerationMethods);
        });
      } else {
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } catch (listError) {
      console.error('Could not list models:', listError.message);
    }

    // Now let's try the models one by one
    const modelsToTry = [
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-pro-vision',
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-pro',
      'gemini-pro-vision'
    ];

    console.log('\n=== TRYING EACH MODEL ===');
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`\nTrying: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Try a simple text generation
        const result = await model.generateContent('Say "test successful"');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}`);
        console.log(`Response: ${text.substring(0, 50)}`);
        
        // This model works! Use it for the actual request
        return await generatePlan(model, sunExposure, theme, outlinePoints, image, modelName);
        
      } catch (error) {
        console.log(`❌ FAILED: ${modelName} - ${error.message}`);
      }
    }

    throw new Error('No working model found. Your API key may not have access to Gemini models.');

  } catch (error) {
    console.error('=== FINAL ERROR ===');
    console.error('Message:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        instructions: 'Create a NEW API key in Google Cloud Console at https://console.cloud.google.com/apis/credentials and update it in Netlify environment variables'
      })
    };
  }
};

async function generatePlan(model, sunExposure, theme, outlinePoints, image, modelName) {
  console.log(`\n=== GENERATING PLAN WITH ${modelName} ===`);
  
  const imageData = image.split(',')[1];
  
  const prompt = `You are an expert landscape designer for Gertens Garden Center in Minnesota.

Create a garden plan for:
- Sun: ${formatSunExposure(sunExposure)}
- Theme: ${formatTheme(theme)}
- Area: ${outlinePoints.length} outline points
- Location: Minnesota (Zones 3-4)

Recommend 6-8 hardy plants as JSON:
{
  "overview": "design summary",
  "plants": [{"name": "Name (Scientific)", "type": "type", "description": "details", "placement": "location"}],
  "layout": "arrangement tips",
  "tips": ["tip1", "tip2", "tip3"]
}`;

  try {
    // Try with image if it's a vision model
    const isVisionModel = modelName.includes('vision') || modelName.includes('1.5');
    
    let result;
    if (isVisionModel) {
      console.log('Using vision model with image');
      result = await model.generateContent([
        prompt,
        { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
      ]);
    } else {
      console.log('Using text-only model');
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    // Parse JSON
    let cleanText = text.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    const recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanText);

    console.log('✅ Plan generated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        recommendation,
        modelUsed: modelName
      })
    };

  } catch (error) {
    console.error('Generation error:', error.message);
    throw error;
  }
}

function formatSunExposure(exposure) {
  const map = {
    'full-sun': 'Full Sun (6+ hours)',
    'partial-sun': 'Partial Sun (3-6 hours)',
    'mostly-shade': 'Mostly Shade (<3 hours)'
  };
  return map[exposure] || exposure;
}

function formatTheme(theme) {
  const map = {
    'shade-loving': 'Shade Loving',
    'fun-in-sun': 'Fun in the Sun',
    'colors-galore': 'Colors Galore',
    'white-moonlight': 'White Moonlight',
    'minnesota-native': 'Minnesota Native'
  };
  return map[theme] || theme;
}
