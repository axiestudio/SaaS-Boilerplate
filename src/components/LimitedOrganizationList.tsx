'use client';

import { OrganizationList } from '@clerk/nextjs';
import { useOrganizationList } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Building2 } from 'lucide-react';

const MAX_ORGANIZATIONS = 3;

interface LimitedOrganizationListProps {
  afterSelectOrganizationUrl?: string;
  afterCreateOrganizationUrl?: string;
  afterSelectPersonalUrl?: string;
  hidePersonal?: boolean;
  skipInvitationScreen?: boolean;
}

export const LimitedOrganizationList = (props: LimitedOrganizationListProps) => {
  const t = useTranslations('OrganizationLimits');
  const { organizationList, isLoaded } = useOrganizationList();
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [orgCount, setOrgCount] = useState(0);

  useEffect(() => {
    if (isLoaded && organizationList) {
      const count = organizationList.length;
      setOrgCount(count);
      setShowLimitWarning(count >= MAX_ORGANIZATIONS);
    }
  }, [organizationList, isLoaded]);

  return (
    <div className="space-y-6">
      {/* Organization Limit Warning */}
      {showLimitWarning && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>
                {t('organization_limit_reached', { current: orgCount, max: MAX_ORGANIZATIONS })}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Organization Stats */}
      {isLoaded && orgCount > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Your Organizations</h3>
              <p className="text-sm text-gray-600">Manage your organization memberships</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{orgCount}</div>
              <div className="text-xs text-gray-500">of {MAX_ORGANIZATIONS} organizations</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Organizations</span>
              <span>{orgCount}/{MAX_ORGANIZATIONS}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  orgCount >= MAX_ORGANIZATIONS 
                    ? 'bg-amber-500' 
                    : orgCount >= MAX_ORGANIZATIONS * 0.8 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((orgCount / MAX_ORGANIZATIONS) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <OrganizationList
        {...props}
        appearance={{
          elements: {
            organizationListCreateOrganizationButton: showLimitWarning ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
            organizationListCreateOrganizationActionButton: showLimitWarning ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
          },
        }}
      />
    </div>
  );
};
