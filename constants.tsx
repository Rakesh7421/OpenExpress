import React from 'react';
import { Icon } from './components/common/Icon';

export const CLIENT_SIDEBAR_ITEMS = [
  { id: 'templates', label: 'Templates', icon: <Icon name="templates" /> },
  { id: 'text', label: 'Text', icon: <Icon name="text" /> },
  { id: 'images', label: 'Images', icon: <Icon name="image" /> },
  { id: 'shapes', label: 'Shapes', icon: <Icon name="shapes" /> },
];

export const DEVELOPER_SIDEBAR_ITEMS = [
  ...CLIENT_SIDEBAR_ITEMS,
  { id: 'ai', label: 'AI Suggest', icon: <Icon name="sparkles" /> },
  { id: 'branding', label: 'Branding', icon: <Icon name="palette" /> },
  { id: 'collaboration', label: 'Collaborate', icon: <Icon name="users" /> },
  { id: 'version-control', label: 'Versions', icon: <Icon name="git-branch" /> },
  { id: 'integrations', label: 'Integrations', icon: <Icon name="puzzle" /> },
  { id: 'server', label: 'Server', icon: <Icon name="server" /> },
  { id: 'push', label: 'Push', icon: <Icon name="rocket" /> },
];