const http = require('http');

const events = [
  { title: 'Test 1 - Dribbble', time: '1:30 PM', platform: 'Dribbble' },
  { title: 'Test 2 - Dribbble', time: '1:35 PM', platform: 'Dribbble' },
  { title: 'Test 3 - Dribbble', time: '1:40 PM', platform: 'Dribbble' },
  { title: 'Test 4 - Dribbble', time: '1:45 PM', platform: 'Dribbble' },
  { title: 'Test 5 - Dribbble', time: '1:50 PM', platform: 'Dribbble' }
];

async function addEvent(event) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: event.title,
      platform: event.platform,
      status: 'pending',
      time: event.time,
      date: '2026-06-30'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Added: ${event.title}`);
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  try {
    for (let event of events) {
      await addEvent(event);
      await new Promise(r => setTimeout(r, 500));
    }
    console.log('All test events added!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
