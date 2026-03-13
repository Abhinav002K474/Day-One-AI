const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets/avatars');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Simple flat SVG avatars with different background colors and emoji/text
const createSVG = (color, label, emoji) => `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="80">${emoji}</text>
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="white" font-weight="bold">${label}</text>
</svg>`;

const avatars = [
  { name: 'programmer.svg', color: '#8b5cf6', emoji: '💻', label: 'Programmer' },
  { name: 'doctor.svg', color: '#3b82f6', emoji: '🩺', label: 'Doctor' },
  { name: 'gamer.svg', color: '#10b981', emoji: '🎮', label: 'Gamer' },
  { name: 'engineer.svg', color: '#f59e0b', emoji: '⚙️', label: 'Engineer' },
  { name: 'teacher.svg', color: '#ec4899', emoji: '🧑‍🏫', label: 'Teacher' }
];

avatars.forEach(av => {
  const filePath = path.join(outputDir, av.name);
  fs.writeFileSync(filePath, createSVG(av.color, av.label, av.emoji));
  console.log(`Created ${filePath}`);
});
