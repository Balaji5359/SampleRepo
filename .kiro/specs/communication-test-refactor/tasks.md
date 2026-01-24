# Implementation Plan

- [ ] 1. Refactor BaseComponent for JAM and Situation tests only


  - Remove all logic not strictly required for JAM and Situation speaking tests
  - Remove pronunciation and listening test handling code
  - Ensure only long-recording API integration remains
  - Remove cross-test-type conditional logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Refactor BaseComponent2 for Listening and Pronunciation tests only
  - Remove all JAM and situation test logic
  - Ensure only short-recording API integration remains
  - Keep listening-specific audio playback functionality
  - Remove long-recording API calls and related state management
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Optimize TestCompletionHandler for efficient data processing
  - Enhance score extraction accuracy for all test types
  - Improve API error handling and retry logic
  - Optimize streak update functionality
  - Add proper error logging for debugging
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Remove navigation and unrelated API logic from base components
  - Extract navigation logic to parent components or routing handlers
  - Remove API calls not directly related to test execution
  - Remove formatting logic not essential for test functionality
  - Ensure components only handle their core test responsibilities
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Implement test-type-specific recording optimizations
  - Configure BaseComponent for 60-second recordings with single-recording limitation
  - Configure BaseComponent2 for 10-15 second recordings with multiple recording capability
  - Optimize audio processing pipelines for each test type
  - Implement appropriate recording duration logic based on test level
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Create unit tests for refactored components
  - Write tests for BaseComponent JAM and Situation test functionality
  - Write tests for BaseComponent2 Listening and Pronunciation test functionality
  - Write tests for TestCompletionHandler data processing and API integration
  - Create mock implementations for audio recording and API calls
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 7. Implement integration tests for complete test flows
  - Test end-to-end JAM test execution with result submission
  - Test end-to-end Listening test with audio playback and recording
  - Test TestCompletionHandler integration with both component types
  - Verify proper API endpoint usage and data flow
  - _Requirements: 3.2, 4.4, 5.1, 5.2_

- [ ] 8. Add error handling and performance monitoring
  - Implement comprehensive error handling for audio recording failures
  - Add error handling for API integration failures
  - Implement performance monitoring for audio processing times
  - Add logging for debugging component interactions
  - _Requirements: 3.5, 4.5_