// src/generateData.js
import fs from 'fs';

const generateData = () => {
  const data = [];
  const startDate = new Date(2024, 0, 1); // January 1, 2024

  for (let i = 0; i < 500; i++) {
    const randomDays = Math.floor(Math.random() * 365); // Random days within the year
    const date = new Date(startDate);
    date.setDate(date.getDate() + randomDays);
    
    data.push({
      date: date.toISOString().split('T')[0],
      title: `Blog Post ${i + 1}`,
      slug: `/blog-post-${i + 1}`
    });
  }

  // Save to data.js file
  const fileContent = `export const data = ${JSON.stringify(data, null, 2)};`;

  fs.writeFileSync('./src/data.js', fileContent, 'utf-8');
  console.log('Data generated and saved to data.js');
};

generateData();
