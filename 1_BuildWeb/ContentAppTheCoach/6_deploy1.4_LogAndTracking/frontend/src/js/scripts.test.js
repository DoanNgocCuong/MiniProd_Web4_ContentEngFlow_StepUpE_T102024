import { initializeTabs, initializeFeedback } from './scripts.js';
import { handleGenerateClick } from './generateQuestion.js';

describe('DOMContentLoaded event listener', () => {
});
it('Should initialize tabs when DOM content is loaded', () => {
  // Mock the necessary functions and elements
  const mockInitializeTabs = jest.fn();
  const mockInitializeFeedback = jest.fn();
  const mockAddEventListener = jest.fn();
  
  // Mock the document object
  document.getElementById = jest.fn().mockReturnValue({
    addEventListener: mockAddEventListener
  });
  
  // Replace the original functions with mocks
  global.initializeTabs = mockInitializeTabs;
  global.initializeFeedback = mockInitializeFeedback;
  
  // Simulate DOMContentLoaded event
  document.dispatchEvent(new Event('DOMContentLoaded'));
  
  // Check if initializeTabs was called
  expect(mockInitializeTabs).toHaveBeenCalledTimes(1);
  
  // Additional checks to ensure other functions were called
  expect(mockInitializeFeedback).toHaveBeenCalledTimes(1);
  expect(document.getElementById).toHaveBeenCalledWith('generate-btn');
  expect(document.getElementById).toHaveBeenCalledWith('copy-selected-lessons');
  expect(mockAddEventListener).toHaveBeenCalledTimes(2);
});