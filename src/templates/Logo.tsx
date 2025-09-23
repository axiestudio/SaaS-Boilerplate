import Image from 'next/image';

import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center text-xl font-semibold">
    <Image
      src="/axie-logo.webp"
      alt="Axie Studio Logo"
      width={32}
      height={32}
      className="mr-2"
    />
    {!props.isTextHidden && AppConfig.name}
  </div>
);
