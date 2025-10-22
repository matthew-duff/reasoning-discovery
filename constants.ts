
import { Page } from './types';

export const NAV_ITEMS: { name: Page; icon: string }[] = [
  { name: 'Import', icon: 'upload' },
  { name: 'Query', icon: 'search' },
  { name: 'Documents', icon: 'table' },
  { name: 'Export', icon: 'download' },
];

export const EXAMPLE_QUERIES = [
    "Documents discussing safety test failures for Project Titan.",
    "All communications regarding the acquisition of Innovate Inc.",
    "Any mention of intellectual property theft between January and March.",
    "Find emails containing performance reviews for the engineering team.",
];