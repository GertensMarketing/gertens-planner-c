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
    const { plants, sunExposure, theme, originalImage } = JSON.parse(event.body);

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

    // Use Gemini 2.5 Flash with the original image for better context
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('Asking Gemini to analyze the scene and create watercolor prompt...');

    // First, get Gemini to describe the scene so we can create a more accurate watercolor
    const imageData = originalImage ? originalImage.split(',')[1] : null;
    
    let enhancedPrompt = prompt;
    
    if (imageData) {
      const analysisResult = await visionModel.generateContent([
        'Describe this garden/yard scene briefly. Include: the house style, current landscape features, viewpoint/angle, and any existing hardscape elements. Keep it under 100 words.',
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);
      
      const sceneDescription = await analysisResult.response.text();
      console.log('Scene description:', sceneDescription.substring(0, 150));
      
      // Enhance prompt with scene details
      enhancedPrompt = `Watercolor painting showing this exact scene: ${sceneDescription}

But with the garden bed transformed and filled with beautiful blooming plants: ${plantNames}, ${colors.join(', ')} flowers, lush green foliage.

Maintain the same viewpoint, house position, and all architectural elements from the original scene.
The garden bed is now mature and in full bloom with these specific plants arranged beautifully.
${lighting}, professional watercolor illustration style, soft flowing colors, 
artistic landscape visualization, delicate brush strokes, layered washes.
The house and yard stay the same - only the garden bed is transformed with flowers.`;
    }
    
    console.log('Enhanced prompt created');
    console.log('Calling Imagen API...');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: enhancedPrompt
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
  const lighting = sunExposure === 'full-sun' ? 'bright sunny day, warm golden sunlight' : 
                   sunExposure === 'partial-sun' ? 'soft dappled sunlight' : 
                   'gentle shade, cool peaceful lighting';
  
  const mood = theme === 'white-moonlight' ? 'elegant white flower garden' :
               theme === 'colors-galore' ? 'vibrant colorful garden' :
               theme === 'minnesota-native' ? 'natural prairie wildflower garden' :
               theme === 'shade-loving' ? 'lush green woodland garden' :
               theme === 'fun-in-sun' ? 'cheerful sunny flower garden' :
               'beautiful flower garden';

  const colorDescription = colors.length > 0 ? 
    `with ${colors.join(', ')} blooms` : 
    'with colorful flowers';

  return `Watercolor painting of a suburban home's front yard garden in full summer bloom. 
The scene shows a residential house with landscaping in the foreground.
The garden bed near the house entrance is filled with ${plantNames}, ${colorDescription}, and lush green foliage in a ${mood} style.
${lighting}, residential setting, house visible in background, front yard perspective.
Professional watercolor illustration style, soft flowing translucent colors, 
artistic landscape visualization showing both the home and garden together,
delicate brush strokes, soft edges, layered washes, botanical watercolor art.
The garden bed is the focal point with beautiful mature blooming plants, 
while the house and surrounding yard provide context.
Natural residential landscape composition.`;
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
