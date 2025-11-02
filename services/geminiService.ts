
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
