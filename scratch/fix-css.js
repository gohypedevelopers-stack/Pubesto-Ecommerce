const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let content = fs.readFileSync(cssPath, 'utf8');

const target = `.dropdown-form input {
  border: 1px solid rgba(63, 100, 105, 0.25) !important;`;

const replacement = `.dropdown-form input {
  width: 100% !important;
  border: 1px solid rgba(63, 100, 105, 0.25) !important;`;

// Normalize line endings to do search
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const result = normalizedContent.replace(normalizedTarget, normalizedReplacement);
  // Restore original line endings (CRLF for Windows)
  const finalContent = result.replace(/\n/g, '\r\n');
  fs.writeFileSync(cssPath, finalContent, 'utf8');
  console.log('Successfully updated app/globals.css');
} else {
  console.error('Target CSS block not found in app/globals.css!');
}
