const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'controllers');

fs.readdirSync(controllersDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace parseInt(req.params.id) with parseInt(req.params.id as string)
    content = content.replace(/parseInt\(req\.params\.id\)/g, 'parseInt(req.params.id as string)');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Fixed req.params.id casting');
