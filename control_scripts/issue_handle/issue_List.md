# Current Issue

**Issue ID**: missing-breadcrumb-component-002
**Timestamp**: 2024-12-19 15:45:00
**Description**: Module not found error for breadcrumb component - shadcn/ui breadcrumb component not properly installed
**Error Messages**: 
```
Module not found: Can't resolve '@/components/ui/breadcrumb'
./src/components/DeckDetailClient.tsx:8:1
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
```
**Context**: Using breadcrumb component in DeckDetailClient but component file doesn't exist
**Priority**: High
**Status**: Open