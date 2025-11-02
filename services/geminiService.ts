
export async function getDesignSuggestions(prompt: string): Promise<string> {
  try {
    // This now calls our own backend, which will securely call the Gemini API.
    const response = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error calling backend for AI suggestions:", error);
    if (error instanceof Error) {
        // Re-throw with a more user-friendly message that will be displayed in the UI
        throw new Error(`Failed to fetch design suggestions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching suggestions.");
  }
}

export async function getPostIdeas(brand: string, platform: string): Promise<string[]> {
  try {
    const platformIds = ['meta', 'x', 'linkedin', 'tiktok'];
    const token = platformIds.reduce<string | null>((foundToken, id) => {
        if (foundToken) return foundToken;
        return localStorage.getItem(`${id}_jwt`);
    }, null);

    if (!token) {
        throw new Error('Authentication required. Please connect an account in the Branding panel.');
    }

    const response = await fetch('/api/ai-post-ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ brand, platform }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.ideas;
  } catch (error) {
    console.error("Error calling backend for AI post ideas:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch post ideas: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching ideas.");
  }
}
