'use client';

import { OrganizationProfile } from '@clerk/nextjs';
import { useOrganization } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, UserPlus } from 'lucide-react';

const MAX_MEMBERS = 5;

interface LimitedOrganizationProfileProps {
  routing?: 'hash' | 'path' | 'virtual';
  path?: string;
  afterLeaveOrganizationUrl?: string;
  appearance?: any;
}

export const LimitedOrganizationProfile = (props: LimitedOrganizationProfileProps) => {
  const t = useTranslations('OrganizationLimits');
  const { organization, memberships, isLoaded } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const [showMemberLimit, setShowMemberLimit] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (isLoaded && memberships?.data) {
      const count = memberships.data.length;
      setMemberCount(count);
      setShowMemberLimit(count >= MAX_MEMBERS);
    }
  }, [memberships, isLoaded]);

  return (
    <div className="space-y-6">
      {/* Member Limit Warning */}
      {showMemberLimit && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>
                {t('member_limit_reached', { current: memberCount, max: MAX_MEMBERS })}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Organization Stats */}
      {isLoaded && organization && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{organization.name}</h3>
              <p className="text-sm text-gray-600">Team Management</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{memberCount}</div>
              <div className="text-xs text-gray-500">of {MAX_MEMBERS} members</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Team Members</span>
              <span>{memberCount}/{MAX_MEMBERS}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  memberCount >= MAX_MEMBERS 
                    ? 'bg-amber-500' 
                    : memberCount >= MAX_MEMBERS * 0.8 
                      ? 'bg-yellow-500' 
                      : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min((memberCount / MAX_MEMBERS) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Member Status */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {memberCount === 1 ? '1 member' : `${memberCount} members`}
              {showMemberLimit && (
                <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                  Limit Reached
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      <OrganizationProfile
        {...props}
        appearance={{
          ...props.appearance,
          elements: {
            ...props.appearance?.elements,
            // Disable invite-related elements when at limit
            organizationProfilePage__inviteMembers: showMemberLimit ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
            organizationProfileMembersPage__inviteMembers: showMemberLimit ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
            organizationProfileMembersPage__inviteMembersButton: showMemberLimit ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
            inviteMembersButton: showMemberLimit ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
          },
        }}
      />
    </div>
  );
};
