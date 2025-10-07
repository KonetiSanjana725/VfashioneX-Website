import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customizationPrompt, originalImageUrl } = await req.json();
    
    if (!customizationPrompt) {
      throw new Error('Customization prompt is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating custom design with prompt:', customizationPrompt);

    // Build the messages array for AI
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a fashion design AI. Generate realistic fashion item images based on user descriptions and modifications.'
      },
      {
        role: 'user',
        content: originalImageUrl 
          ? [
              {
                type: 'text',
                text: `Create a fashion design based on this image with the following modifications: ${customizationPrompt}`
              },
              {
                type: 'image_url',
                image_url: { url: originalImageUrl }
              }
            ]
          : `Create a fashion design: ${customizationPrompt}`
      }
    ];

    // Use the image generation model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages,
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('Design generation failed');
    }

    const data = await response.json();
    console.log('AI Response received');

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImage) {
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: generatedImage,
        description: data.choices?.[0]?.message?.content || 'Custom design generated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-custom-design function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
