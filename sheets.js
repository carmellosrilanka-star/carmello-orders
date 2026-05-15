// Netlify serverless function — proxies requests to Google Apps Script
// Lives on same domain as your app so zero CORS issues

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTEJeav-7IHd-7Jbi6Td6A7FItWsNnZDdDyuWwt6lAk0jTkQ0RJLwjJLWnBMZQHyTn8Q/exec';

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const action = body.action || 'getOrders';

    // Build URL with all params
    let url = APPS_SCRIPT_URL + '?action=' + action;
    if (action !== 'getOrders') {
      url += '&data=' + encodeURIComponent(JSON.stringify(body));
    }

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow'
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: text
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
