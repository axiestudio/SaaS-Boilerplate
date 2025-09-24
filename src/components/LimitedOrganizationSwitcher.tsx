'use client';

import { OrganizationSwitcher } from '@clerk/nextjs';
import { useOrganizationList } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const MAX_ORGANIZATIONS = 3;

interface LimitedOrganizationSwitcherProps {
  organizationProfileMode?: 'modal' | 'navigation';
  organizationProfileUrl?: string;
  createOrganizationMode?: 'modal' | 'navigation';
  createOrganizationUrl?: string;
  hidePersonal?: boolean;
  appearance?: any;
}

export const LimitedOrganizationSwitcher = (props: LimitedOrganizationSwitcherProps) => {
  const { organizationList, isLoaded } = useOrganizationList();
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    if (isLoaded && organizationList) {
      const count = organizationList.length;
      setShowLimitWarning(count >= MAX_ORGANIZATIONS);
    }
  }, [organizationList, isLoaded]);

  return (
    <OrganizationSwitcher
      {...props}
      appearance={{
        ...props.appearance,
        elements: {
          ...props.appearance?.elements,
          // Disable create organization button when at limit
          organizationSwitcherTriggerIcon: showLimitWarning ? 'opacity-75' : '',
          organizationSwitcherPopoverActionButton__createOrganization: showLimitWarning ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
          organizationSwitcherPreviewButton__createOrganization: showLimitWarning ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
        },
      }}
    />
  );
};
