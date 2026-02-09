// This function creates a bird's eye planting diagram using SVG
// Much faster than AI image generation and more reliable

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { outlinePoints, plants } = JSON.parse(event.body);

    console.log('Generating SVG bird\'s eye diagram...');
    console.log('Outline points:', outlinePoints.length);
    console.log('Plants:', plants.length);

    // Create SVG diagram
    const svg = createBirdEyeDiagram(outlinePoints, plants);

    console.log('✅ SVG diagram generated');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        diagram: svg,
        type: 'svg'
      })
    };

  } catch (error) {
    console.error('Error generating diagram:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

function createBirdEyeDiagram(outlinePoints, plants) {
  // Calculate bounds of the outline
  const xs = outlinePoints.map(p => p.x);
  const ys = outlinePoints.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Add padding
  const padding = 50;
  const svgWidth = width + (padding * 2);
  const svgHeight = height + (padding * 2);
  
  // Normalize points
  const normalizedPoints = outlinePoints.map(p => ({
    x: p.x - minX + padding,
    y: p.y - minY + padding
  }));
  
  // Create polygon path
  const pathData = normalizedPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';
  
  // Place plants strategically
  const plantPlacements = distributePlants(normalizedPoints, plants, width, height, padding);
  
  // Generate SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <!-- Background -->
    <rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e40af">
      Bird's Eye Planting Diagram
    </text>
    
    <!-- Garden Bed Outline -->
    <path d="${pathData}" fill="#e8f5e9" stroke="#1e40af" stroke-width="3" stroke-dasharray="5,5"/>
    
    <!-- Grid (optional) -->
    ${generateGrid(svgWidth, svgHeight, padding)}
    
    <!-- Plants -->
    ${plantPlacements.map((placement, i) => `
      <!-- Plant ${i + 1}: ${placement.plant.name} -->
      <g>
        <circle cx="${placement.x}" cy="${placement.y}" r="${placement.radius}" 
                fill="${getPlantColor(placement.plant.type)}" 
                fill-opacity="0.7" 
                stroke="#2e7d32" 
                stroke-width="2"/>
        <text x="${placement.x}" y="${placement.y - placement.radius - 5}" 
              text-anchor="middle" 
              font-size="10" 
              font-weight="bold" 
              fill="#1e40af">
          ${i + 1}
        </text>
      </g>
    `).join('\n')}
    
    <!-- Legend -->
    <g transform="translate(10, ${svgHeight - 150})">
      <rect width="180" height="${Math.min(plants.length * 20 + 40, 140)}" fill="white" stroke="#1e40af" stroke-width="1"/>
      <text x="10" y="20" font-size="12" font-weight="bold" fill="#1e40af">Plant Legend:</text>
      ${plants.map((plant, i) => `
        <g transform="translate(10, ${30 + i * 20})">
          <circle cx="5" cy="0" r="5" fill="${getPlantColor(plant.type)}" fill-opacity="0.7" stroke="#2e7d32"/>
          <text x="15" y="4" font-size="10" fill="#000">${i + 1}. ${plant.name.split('(')[0].trim()}</text>
        </g>
      `).slice(0, 5).join('\n')}
      ${plants.length > 5 ? `<text x="10" y="${30 + 5 * 20}" font-size="9" fill="#666">...and ${plants.length - 5} more</text>` : ''}
    </g>
    
    <!-- Scale -->
    <g transform="translate(${svgWidth - 120}, ${svgHeight - 40})">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#000" stroke-width="2"/>
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#000" stroke-width="2"/>
      <line x1="100" y1="-5" x2="100" y2="5" stroke="#000" stroke-width="2"/>
      <text x="50" y="15" text-anchor="middle" font-size="10">Approx. Scale</text>
    </g>
  </svg>`;
  
  return svg;
}

function generateGrid(width, height, padding) {
  const gridSize = 40;
  let grid = '';
  
  for (let x = padding; x < width; x += gridSize) {
    grid += `<line x1="${x}" y1="${padding}" x2="${x}" y2="${height - padding}" stroke="#ddd" stroke-width="0.5"/>`;
  }
  
  for (let y = padding; y < height; y += gridSize) {
    grid += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#ddd" stroke-width="0.5"/>`;
  }
  
  return grid;
}

function distributePlants(points, plants, width, height, padding) {
  const placements = [];
  
  // Calculate center of polygon
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
  plants.forEach((plant, index) => {
    let x, y, radius;
    
    // Determine size based on type and placement
    if (plant.type === 'tree' || plant.type === 'shrub') {
      radius = 20;
    } else {
      radius = 12;
    }
    
    // Place based on placement description
    const placement = plant.placement.toLowerCase();
    
    if (placement.includes('back')) {
      // Place in back (top) area
      y = padding + (height * 0.2);
      x = centerX + (index - plants.length/2) * 40;
    } else if (placement.includes('front')) {
      // Place in front (bottom) area
      y = padding + height * 0.8;
      x = centerX + (index - plants.length/2) * 30;
    } else {
      // Place in middle
      y = centerY;
      x = centerX + (index - plants.length/2) * 35;
    }
    
    // Add some randomness for natural look
    x += (Math.random() - 0.5) * 20;
    y += (Math.random() - 0.5) * 20;
    
    placements.push({ x, y, radius, plant });
  });
  
  return placements;
}

function getPlantColor(type) {
  const colors = {
    'perennial': '#81c784',
    'shrub': '#66bb6a',
    'tree': '#4caf50',
    'grass': '#aed581'
  };
  return colors[type] || '#81c784';
}
