'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { ActiveLink } from '@/components/ActiveLink';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ToggleMenuButton } from '@/components/ToggleMenuButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/templates/Logo';
import { getI18nPath } from '@/utils/Helpers';

export const DashboardHeader = (props: {
  menu: {
    href: string;
    label: string;
  }[];
}) => {
  const locale = useLocale();

  return (
    <>
      <div className="flex items-center">
        <Link href="/dashboard" className="max-sm:hidden">
          <Logo />
        </Link>
      </div>

      {/* 🎯 CENTERED NAVIGATION */}
      <nav className="max-lg:hidden">
        <ul className="flex flex-row items-center gap-x-6 text-lg font-medium [&_a:hover]:opacity-100 [&_a]:opacity-75">
          {props.menu.map(item => (
            <li key={item.href}>
              <ActiveLink href={item.href}>{item.label}</ActiveLink>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <ul className="flex items-center gap-x-1.5 [&_li[data-fade]:hover]:opacity-100 [&_li[data-fade]]:opacity-60">
          <li data-fade>
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToggleMenuButton />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {props.menu.map(item => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>

          {/* PRO: Dark mode toggle button */}

          <li data-fade>
            <LocaleSwitcher />
          </li>

          <li>
            <OrganizationSwitcher
              organizationProfileMode="navigation"
              organizationProfileUrl="/dashboard/organization-profile"
              createOrganizationMode="navigation"
              createOrganizationUrl="/onboarding/organization-selection"
              hidePersonal={false}
              appearance={{
                elements: {
                  rootBox: 'px-2 py-1.5',
                },
              }}
            />
          </li>

          <li>
            <Separator orientation="vertical" className="h-4" />
          </li>

          <li>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/dashboard/user-profile"
              appearance={{
                elements: {
                  rootBox: 'px-2 py-1.5',
                },
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
