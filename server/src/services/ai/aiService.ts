import dotenv from 'dotenv';
import { AIProvider } from './aiInterface';
import { MockAIAdapter } from './mockAdapter';
import { GeminiAIAdapter } from './geminiAdapter';

export function getAIProvider(): AIProvider {
  dotenv.config();
  const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0 && !geminiKey.includes('placeholder')) {
    console.log('🤖 AI Provider: Using Live Gemini API Adapter');
    return new GeminiAIAdapter(geminiKey.trim());
  }

  console.log('⚡ AI Provider: Using Intelligent Placement Mock Adapter (No API Key Required)');
  return new MockAIAdapter();
}
