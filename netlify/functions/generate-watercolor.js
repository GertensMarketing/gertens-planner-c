// This function generates a watercolor rendering using Google's Imagen (via Gemini API)
// Uses the imagen-4.0 model available in your Gemini API key

const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { plants, sunExposure, theme } = JSON.parse(event.body);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set');
    }

    console.log('Generating watercolor with Gemini Imagen...');
    console.log('Plants:', plants.length);

    // Create detailed prompt for watercolor garden
    const plantNames = plants.map(p => p.name.split('(')[0].trim()).slice(0, 6).join(', ');
    const colors = extractColors(plants);
    
    const prompt = createWatercolorPrompt(plantNames, colors, sunExposure, theme);
    
    console.log('Prompt created:', prompt.substring(0, 100) + '...');

    // Use Imagen 4.0 model for image generation
    // This is Google's latest image generation model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "4:3",
          safetyFilterLevel: "block_some",
          personGeneration: "dont_allow"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Imagen API error:', response.status, errorText);
      throw new Error(`Imagen API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated image
    let imageBase64;
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
      imageBase64 = data.predictions[0].bytesBase64Encoded;
    } else if (data.predictions && data.predictions[0] && data.predictions[0].image) {
      imageBase64 = data.predictions[0].image.bytesBase64Encoded;
    } else {
      console.error('Unexpected response format:', JSON.stringify(data).substring(0, 200));
      throw new Error('Could not extract image from response');
    }

    console.log('✅ Watercolor image generated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        image: imageBase64,
        type: 'png'
      })
    };

  } catch (error) {
    console.error('Error generating watercolor:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        note: 'Watercolor generation failed - your plant plan is still complete!'
      })
    };
  }
};

function createWatercolorPrompt(plantNames, colors, sunExposure, theme) {
  const lighting = sunExposure === 'full-sun' ? 'bright sunny day, warm golden light' : 
                   sunExposure === 'partial-sun' ? 'soft dappled sunlight filtering through trees' : 
                   'gentle shade, cool peaceful lighting';
  
  const mood = theme === 'white-moonlight' ? 'elegant white flower garden, serene and peaceful' :
               theme === 'colors-galore' ? 'vibrant rainbow garden bursting with color' :
               theme === 'minnesota-native' ? 'natural prairie wildflower garden' :
               theme === 'shade-loving' ? 'lush green woodland garden' :
               theme === 'fun-in-sun' ? 'cheerful sunny flower garden' :
               'beautiful flower garden';

  const colorDescription = colors.length > 0 ? 
    `featuring ${colors.join(', ')} blooms` : 
    'with colorful flowers';

  return `A beautiful watercolor painting of a ${mood} in full summer bloom. 
Garden bed filled with ${plantNames}, ${colorDescription}, and lush green foliage. 
${lighting}, professional watercolor illustration style by a landscape artist. 
Soft flowing translucent colors, artistic garden design visualization, 
dreamy botanical aesthetic, high quality botanical watercolor art, 
delicate brush strokes, soft edges, layered washes, flowing paint technique. 
Garden bed perspective view, natural organic composition.`;
}

function extractColors(plants) {
  const colorWords = new Set();
  
  plants.forEach(plant => {
    const desc = (plant.description || '').toLowerCase();
    const name = (plant.name || '').toLowerCase();
    const combined = desc + ' ' + name;
    
    // Extract color words from plant descriptions
    if (combined.includes('purple') || combined.includes('lavender') || combined.includes('violet')) {
      colorWords.add('purple');
    }
    if (combined.includes('pink') || combined.includes('rose')) {
      colorWords.add('pink');
    }
    if (combined.includes('white') || combined.includes('cream')) {
      colorWords.add('white');
    }
    if (combined.includes('yellow') || combined.includes('golden') || combined.includes('gold')) {
      colorWords.add('yellow');
    }
    if (combined.includes('red') || combined.includes('ruby') || combined.includes('crimson')) {
      colorWords.add('red');
    }
    if (combined.includes('blue') || combined.includes('azure')) {
      colorWords.add('blue');
    }
    if (combined.includes('orange') || combined.includes('coral')) {
      colorWords.add('orange');
    }
    if (combined.includes('chartreuse') || combined.includes('lime') || combined.includes('green')) {
      colorWords.add('green');
    }
  });
  
  return Array.from(colorWords);
}
