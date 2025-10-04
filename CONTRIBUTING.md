# Contributing to M4LLib

Thank you for your interest in contributing to M4LLib! This document provides guidelines and information for contributors.

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- ** Bug Reports**: Help us identify and fix issues
- ** Recommendations**: Help us improve the library
- ** Feature Requests**: Suggest new functionality
- ** Documentation**: Improve guides and examples
- ** Code Contributions**: Add new features or fix bugs
- ** Testing**: Help test the library
- ** Examples**: Create useful example projects

### Before You Start

1. **Check existing issues** to see if your idea has already been discussed
2. **Read the documentation** to understand the current API

## Development Setup

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/M4LLib.git
   cd M4LLib
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Code Style Guidelines

### JavaScript Standards

- Use **ES6+** features when possible
- Follow **JSDoc** documentation standards
- Maintain **consistent indentation** (2 spaces)
- Use **descriptive variable names**
- Add **error handling** with try-catch blocks for all public methods
- **Validate inputs** before processing
- Provide **helpful error messages**

### Max for Live Standards

- Always **free LiveAPI objects** with `freepeer()` (or use `withLiveAPI`)
- Always **free dictionaries** with `freepeer()`
- Use **consistent ID handling** (numeric IDs, not ID strings like `id 1`)

## Testing

### Testing Guidelines

- **Test your changes** in Max for Live before submitting
- **Test edge cases** (invalid inputs, error conditions)
- **Test with different Live versions** if possible
- **Document any limitations** or known issues

### Test Scenarios

- **Happy path**: Normal usage with valid inputs
- **Error cases**: Invalid inputs, missing resources
- **Edge cases**: Boundary values, unusual scenarios
- **Real-world usage**: Actual Max for Live projects

## Documentation

### Documentation Standards

- **Add JSDoc comments** for all new methods. Documentation will be generated from these comments.

### Example Documentation

```javascript
/**
 * Adds notes to an existing MIDI clip
 * 
 * @static
 * @param {Object} clip - The LiveAPI clip object
 * @param {Object} notes - Notes data object
 * @param {Array} notes.notes - Array of note objects
 * @returns {boolean} Success status
 * 
 * @example
 * const notes = { 
 *     notes: [
 *         { pitch: 60, start_time: 0, duration: 1, velocity: 100 }
 *     ] 
 * };
 * const success = M4LLib.addNotesToClip(clip, notes);
 */
```

## Pull Request Process

### Before Submitting

1. **Test thoroughly** in Max for Live
2. **Update documentation** if needed
3. **Add tests** if applicable
4. **Check code style** and formatting

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Example addition

## Testing
- [ ] Tested in Max for Live
- [ ] Tested with different Live versions
- [ ] Added/updated examples

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No breaking changes (or documented if necessary)
```

### Review Process

1. **Automated checks** will run on your PR
2. **Maintainers** will review your code
3. **Feedback** will be provided if changes are needed
4. **Approval** and merge once everything looks good

## Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Max for Live version:
- Ableton Live version:
- Operating System:
- M4LLib version:

## Additional Information
Screenshots, error messages, etc.
```

## Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think it could be implemented

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions

### Questions?

If you have questions about contributing:

1. **Check the documentation** first
2. **Search existing issues** for similar questions
3. **Open an issue** 