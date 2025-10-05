exports.handler = async (event) => {
  try {
    // Parse incoming data
    const { email, first_name } = JSON.parse(event.body);

    // Check if first_name is missing
    if (!first_name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "First name and email are required." })
      };
    }

    // Get secrets from environment variables
    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    // Make request to Beehiiv API
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          email: email,
          first_name: first_name
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data })
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ success: false, error: data })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
