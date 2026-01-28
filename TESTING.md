# Test-Driven Development (TDD) Documentation

## Overview

This document describes the TDD approach used for the Nanozinco Web Application. All tests are written following TDD methodology where tests define the expected behavior before implementation.

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: DOM matchers

## Test Structure

### 1. Service Layer Tests

#### OTP Service (`services/__tests__/otpService.test.ts`)

**Purpose**: Validate OTP request and verification functionality

**Test Coverage**:
- Phone number formatting (Thai format conversion)
- OTP request with different parameter formats
- OTP verification success/failure scenarios
- API error handling
- Network failure handling
- Request parameter validation

**Key Test Cases**:
```typescript
✓ Phone number format conversion (0xxx → 66xxx)
✓ Handle empty/null/undefined phone numbers
✓ Successfully request OTP with phone string
✓ Successfully request OTP with request object
✓ Handle API error responses
✓ Handle network failures
✓ Verify correct phone formatting in requests
✓ Successfully verify OTP
✓ Handle invalid OTP codes
✓ Handle expired tokens
```

#### UUID Utility (`src/utils/__tests__/uuid.test.ts`)

**Purpose**: Ensure UUID generation follows RFC 4122 v4 standard

**Test Coverage**:
- UUID format validation
- Uniqueness verification
- Character set validation
- Version and variant bit validation

**Key Test Cases**:
```typescript
✓ Generate valid UUID v4 format
✓ Generate unique UUIDs
✓ Correct length (36 characters)
✓ Hyphens at correct positions
✓ Version 4 indicator present
✓ Correct variant bits
✓ 1000 unique UUIDs without collisions
✓ Only hexadecimal characters
```

### 2. Context Layer Tests

#### AuthContext (`contexts/__tests__/AuthContext.test.tsx`)

**Purpose**: Validate authentication state management

**Test Coverage**:
- Initial authentication state
- Login functionality
- Logout functionality
- PIN management (save, verify, retrieve)
- Profile updates
- Last user tracking
- localStorage persistence
- Error handling

**Key Test Cases**:
```typescript
✓ Start unauthenticated
✓ Restore state from localStorage
✓ Successfully login user
✓ Save last user info on login
✓ Successfully logout
✓ Keep last user after logout
✓ Save PIN for phone number
✓ Verify correct PIN
✓ Reject incorrect PIN
✓ Update existing PIN
✓ Store multiple PINs
✓ Persist PINs in localStorage
✓ Update user profile
✓ Clear last user info
✓ Handle corrupted localStorage
```

#### LanguageContext (`contexts/__tests__/LanguageContext.test.tsx`)

**Purpose**: Validate multi-language support

**Test Coverage**:
- Default language initialization
- Language switching (EN/TH/ZH)
- Translation function
- localStorage persistence
- Error handling

**Key Test Cases**:
```typescript
✓ Default to English
✓ Restore language from localStorage
✓ Switch to Thai language
✓ Switch to Chinese language
✓ Persist language preference
✓ Handle all supported languages
✓ Provide translation function
✓ Return key if translation not found
✓ Change translations with language
✓ Handle corrupted localStorage
✓ Handle rapid language switches
```

#### CartContext (`contexts/__tests__/CartContext.test.tsx`)

**Purpose**: Validate shopping cart functionality

**Test Coverage**:
- Cart initialization
- Add to cart
- Remove from cart
- Update quantities
- Clear cart
- Price calculations
- localStorage persistence
- Edge cases

**Key Test Cases**:
```typescript
✓ Start with empty cart
✓ Zero total items/price initially
✓ Restore cart from localStorage
✓ Add product to cart
✓ Increase quantity for existing product
✓ Add multiple different products
✓ Add with specified quantity
✓ Remove product from cart
✓ Update product quantity
✓ Remove item when quantity is 0
✓ Clear all items
✓ Calculate total items correctly
✓ Calculate total price correctly
✓ Get item count for product
✓ Handle corrupted localStorage
```

## Running Tests

### Run All Tests
```bash
bun test
```

### Watch Mode (for TDD workflow)
```bash
bun test:watch
```

### Coverage Report
```bash
bun test:coverage
```

### CI Mode
```bash
bun test:ci
```

## TDD Workflow

### 1. Red Phase - Write Failing Test
```typescript
it('should format Thai phone number to international format', () => {
  const result = formatPhoneNumber('0812345678');
  expect(result).toBe('66812345678');
});
```

### 2. Green Phase - Write Minimal Code to Pass
```typescript
export function formatPhoneNumber(phone: string): string {
  if (!phone) throw new Error('Phone number is required');
  if (phone.startsWith('0')) {
    return '66' + phone.substring(1);
  }
  return phone;
}
```

### 3. Refactor Phase - Improve Code
```typescript
export function formatPhoneNumber(phone: string): string {
  if (!phone) throw new Error('Phone number is required');
  if (!/^\d+$/.test(phone)) throw new Error('Invalid phone number format');
  if (phone.length < 10) throw new Error('Invalid phone number format');
  
  return phone.startsWith('0') ? '66' + phone.substring(1) : phone;
}
```

## Test Principles

### 1. Independent Tests
- Each test can run independently
- No shared state between tests
- Use `beforeEach` to reset state

### 2. Descriptive Names
- Test names describe expected behavior
- Use "should" statements
- Clear and concise

### 3. AAA Pattern
```typescript
it('should add product to cart', () => {
  // Arrange - Set up test data
  const product = mockProduct;
  
  // Act - Perform action
  act(() => {
    result.current.addItem(product);
  });
  
  // Assert - Verify outcome
  expect(result.current.items).toHaveLength(1);
});
```

### 4. Edge Cases
- Test boundary conditions
- Test error cases
- Test null/undefined inputs
- Test corrupted data

### 5. Mock External Dependencies
- Mock fetch API for HTTP calls
- Mock localStorage/sessionStorage
- Mock Next.js navigation

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

Tests should run:
- On every commit (pre-commit hook)
- On pull requests
- Before deployment
- Nightly for full test suite

## Test Maintenance

### When to Update Tests
1. When requirements change
2. When bugs are discovered (add regression test)
3. When refactoring code
4. When adding new features

### Test Review Checklist
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Tests are fast
- [ ] Tests follow AAA pattern
- [ ] Edge cases covered
- [ ] Mocks are appropriate
- [ ] Test names are descriptive

## Best Practices

1. **Write tests first** - Define behavior before implementation
2. **One assertion per test** - When possible, test one thing
3. **Use descriptive names** - Test name should explain what it tests
4. **Keep tests simple** - Tests should be easier to understand than code
5. **Test behavior, not implementation** - Focus on what, not how
6. **Mock external dependencies** - Keep tests fast and reliable
7. **Clean up after tests** - Reset state in beforeEach/afterEach
8. **Use test data builders** - Create reusable test data

## Common Patterns

### Testing Context Providers
```typescript
const wrapper = ({ children }) => (
  <Provider>{children}</Provider>
);

const { result } = renderHook(() => useContext(), { wrapper });
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

### Testing User Actions
```typescript
act(() => {
  result.current.performAction();
});
```

### Testing localStorage
```typescript
beforeEach(() => {
  localStorage.clear();
});

it('should persist data', () => {
  // ... test code
  expect(localStorage.getItem('key')).toBe('value');
});
```

## Troubleshooting

### Tests Timing Out
- Increase timeout: `jest.setTimeout(10000)`
- Check for missing `waitFor` calls
- Verify async operations complete

### Flaky Tests
- Remove shared state
- Add proper cleanup
- Use `waitFor` for async operations
- Avoid time-dependent logic

### Mock Issues
- Clear mocks in `beforeEach`
- Use `jest.resetAllMocks()`
- Verify mock implementation

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
