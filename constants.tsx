import React from 'react';
import { Icon } from './components/common/Icon';

export const CLIENT_SIDEBAR_ITEMS = [
  { id: 'planner', label: 'Planner', icon: <Icon name="calendar" /> },
  { id: 'templates', label: 'Templates', icon: <Icon name="template" /> },
  { id: 'text', label: 'Text', icon: <Icon name="text" /> },
  { id: 'images', label: 'Images', icon: <Icon name="image" /> },
  { id: 'shapes', label: 'Shapes', icon: <Icon name="shapes" /> },
];

export const DEVELOPER_SIDEBAR_ITEMS = [
  ...CLIENT_SIDEBAR_ITEMS,
  { id: 'branding', label: 'Branding', icon: <Icon name="palette" /> },
  { id: 'feature-analysis', label: 'Analysis', icon: <Icon name="chart" /> },
  { id: 'server', label: 'Server', icon: <Icon name="server" /> },
  { id: 'console', label: 'Console', icon: <Icon name="terminal" /> },
];
