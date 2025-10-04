# GitHub Actions for M4LLib

This directory contains GitHub Actions workflows for automatically managing the M4LLib documentation.

## Available Workflows

### 1. `docs.yml` - Basic Documentation Generator
**Triggers:** Push to main/master, PR to main/master
**Purpose:** Automatically generates and commits API documentation

**Features:**
- Generates `docs/API.md` from JSDoc comments
- Commits changes directly to the branch
- Only runs when library files or package.json change

### 2. `docs-advanced.yml` - Advanced Documentation Generator
**Triggers:** Push to main/master/develop, PR to main/master, Manual dispatch
**Purpose:** Comprehensive documentation management with better feedback

**Features:**
- Generates and validates documentation
- Creates detailed PR comments
- Uploads documentation as artifacts
- Provides workflow summaries
- Handles different branch strategies

### 3. `docs-check.yml` - Documentation Validation
**Triggers:** PR to main/master
**Purpose:** Validates that documentation can be generated without committing

**Features:**
- Checks if documentation generation works
- Validates file format and content
- Comments on PR with status
- Useful for validating JSDoc comments

## Usage

### Automatic Generation
The workflows will automatically run when you:
- Push changes to `lib/` files
- Update `package.json` or `package-lock.json`
- Create pull requests

### Manual Trigger
You can manually trigger the advanced workflow:
1. Go to Actions tab in GitHub
2. Select "Documentation Generator"
3. Click "Run workflow"

### Configuration

#### File Paths
The workflows only run when specific files change:
- `lib/**` - Library source files
- `package.json` - Dependencies
- `package-lock.json` - Lock file

#### Branch Configuration
Update the workflow files to match your branch strategy:
```yaml
branches: [ main, master, develop ]  # Add your branches
```

#### Node.js Version
Currently set to Node.js 18. Update if needed:
```yaml
node-version: '18'  # Change to your preferred version
```

## Customization

### Adding More Triggers
Add more paths or events to the `on:` section:
```yaml
on:
  push:
    paths:
      - 'lib/**'
      - 'docs/**'  # Add more paths
  schedule:
    - cron: '0 0 * * 0'  # Weekly generation
```

### Changing Commit Messages
Modify the commit message in the workflow:
```yaml
git commit -m "docs: auto-generate API documentation [skip ci]"
```

### Adding Notifications
Add Slack or email notifications:
```yaml
- name: Notify on success
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: "Documentation updated successfully!"
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure the workflow has `contents: write` permission
   - Check that `GITHUB_TOKEN` is available

2. **Documentation Not Generated**
   - Verify JSDoc comments are properly formatted
   - Check that `jsdoc-to-markdown` is installed
   - Look at the workflow logs for errors

3. **Empty Documentation**
   - Ensure your JSDoc comments are valid
   - Check that the source files are being processed
   - Verify the file paths in the workflow

### Debug Mode
Add debug output to workflows:
```yaml
- name: Debug information
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Files in lib/: $(ls -la lib/)"
    echo "Package.json scripts: $(npm run)"
```

## Best Practices

1. **Keep JSDoc Comments Updated**
   - Update comments when changing function signatures
   - Use proper JSDoc syntax
   - Include examples and parameter descriptions

2. **Test Locally**
   - Run `npm run docs:generate` before pushing
   - Verify the output looks correct

3. **Review Generated Changes**
   - Check the diff when documentation is auto-committed
   - Ensure the changes make sense

4. **Use Meaningful Commit Messages**
   - The workflows use descriptive commit messages
   - Include `[skip ci]` to avoid triggering other workflows

## Workflow Dependencies

The workflows depend on:
- `package.json` with `docs:generate` script
- `jsdoc-to-markdown` package
- Valid JSDoc comments in source files
- Proper file structure in `docs/` directory
