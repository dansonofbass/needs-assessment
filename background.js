// Graph Background
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Graph settings
const settings = {
    nodeCount: 100,
    nodeRadius: 1.5,
    lineWidth: 0.7,
    nodeColor: 'rgba(204, 204, 204, 0.59)',
    lineColor: 'rgba(161, 161, 161, 0.2)',
    maxDistance: 150,
    nodeSpeed: 0.7,
    depthFactor: 0.5,
    maxConnections: 2, // Maximum connections per node
    fadeSpeed: 0.3, // Speed of fade in/out
    baseLineOpacity: 0.1, // Base opacity for lines
    maxLineOpacity: 0.2   // Maximum opacity for lines
};

// Create nodes with z-depth
const nodes = Array.from({ length: settings.nodeCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 100,
    vx: (Math.random() - 0.5) * settings.nodeSpeed,
    vy: (Math.random() - 0.5) * settings.nodeSpeed,
    vz: (Math.random() - 0.5) * settings.nodeSpeed * 0.5
}));

// Store active connections
const connections = new Map();

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw nodes
    nodes.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        if (node.z < 0 || node.z > 100) node.vz *= -1;

        // Calculate depth factor (0 to 1)
        const depth = node.z / 100;
        
        // Adjust node size based on depth
        const nodeSize = settings.nodeRadius * (1 + depth);
        
        // Adjust node opacity based on depth
        const nodeOpacity = 0.3 + (depth * 0.4);
        const nodeColor = `rgba(204, 204, 204, ${nodeOpacity})`;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
    });

    // Update and draw connections
    const newConnections = new Map();
    
    // Find potential connections
    nodes.forEach((node, i) => {
        const nodeConnections = [];
        
        // Find closest nodes within maxDistance
        const distances = nodes.map((otherNode, j) => ({
            index: j,
            distance: Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) + 
                Math.pow(node.y - otherNode.y, 2)
            )
        })).filter(d => d.distance < settings.maxDistance && d.index !== i)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, settings.maxConnections);

        distances.forEach(({ index }) => {
            const otherNode = nodes[index];
            const connectionKey = [i, index].sort().join('-');
            
            if (!newConnections.has(connectionKey)) {
                nodeConnections.push({
                    node: otherNode,
                    opacity: 0
                });
                newConnections.set(connectionKey, {
                    from: node,
                    to: otherNode,
                    opacity: 0
                });
            }
        });
    });

    // Fade out old connections
    connections.forEach((connection, key) => {
        if (!newConnections.has(key)) {
            connection.opacity -= settings.fadeSpeed;
            if (connection.opacity > 0) {
                drawConnection(connection);
            }
        }
    });

    // Fade in new connections
    newConnections.forEach((connection, key) => {
        if (!connections.has(key)) {
            connection.opacity = 0;
        } else {
            connection.opacity = connections.get(key).opacity;
        }
        
        connection.opacity += settings.fadeSpeed;
        if (connection.opacity > 1) connection.opacity = 1;
        
        drawConnection(connection);
    });

    // Update connections map
    connections.clear();
    newConnections.forEach((value, key) => {
        if (value.opacity > 0) {
            connections.set(key, value);
        }
    });

    requestAnimationFrame(animate);
}

function drawConnection(connection) {
    const avgDepth = (connection.from.z + connection.to.z) / 200;
    // Calculate line opacity based on depth and connection opacity
    const lineOpacity = (settings.baseLineOpacity + (avgDepth * (settings.maxLineOpacity - settings.baseLineOpacity))) * connection.opacity;
    const lineColor = `rgba(161, 161, 161, ${lineOpacity})`;

    ctx.beginPath();
    ctx.moveTo(connection.from.x, connection.from.y);
    ctx.lineTo(connection.to.x, connection.to.y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = settings.lineWidth * (1 + avgDepth);
    ctx.stroke();
}

// Start animation
animate();

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Add slight delay to follower
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.background = 'rgba(128, 128, 128, 0.1)';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.background = 'transparent';
    });
}); 