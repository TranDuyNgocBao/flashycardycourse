# Issue Templates

This file contains templates for common issues and their solutions to help avoid repeating the same mistakes.

## Template Usage
- **Purpose**: Quick reference for common issues and solutions
- **Update Rule**: Append new templates (never replace old content)
- **Format**: Concise, actionable templates
- **Content**: Issue description, common causes, quick fixes, prevention tips

## Available Templates

### Next.js 15 Params Async Error Template

**Issue**: Route params used without awaiting in Next.js 15
**Common Causes**: 
- Upgrading to Next.js 15 without updating dynamic route handlers
- Using `params.property` directly instead of awaiting params first
- Not following Next.js 15 migration guidelines

**Quick Fix**:
1. Change `params.property` to `await params` first
2. Destructure the awaited params: `const { property } = await params`
3. Use the destructured value in your code

**Prevention**:
- Always await params in dynamic routes for Next.js 15+
- Check Next.js migration guide when upgrading
- Test all dynamic routes after version upgrades

---

### Missing shadcn/ui Component Template

**Issue**: Module not found error for shadcn/ui components
**Common Causes**: 
- shadcn/ui component installation failed silently
- Required dependencies not installed
- Component file not created properly
- Import path incorrect

**Quick Fix**:
1. Check if component file exists in src/components/ui/
2. Create component manually if missing
3. Install required dependencies (usually @radix-ui packages)
4. Verify import paths are correct

**Prevention**:
- Always verify component exists after shadcn/ui installation
- Check for required dependencies in component files
- Test imports immediately after installation
- Keep working component implementations as reference

---

---

## How to Add New Templates

When a new issue is resolved, add a template in this format:

```markdown
### [Issue Type] Template

**Issue**: [Brief description]
**Common Causes**: 
- [Cause 1]
- [Cause 2]

**Quick Fix**:
1. [Step 1]
2. [Step 2]

**Prevention**:
- [Prevention tip 1]
- [Prevention tip 2]

---
```
