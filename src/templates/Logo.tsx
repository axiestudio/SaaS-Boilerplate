import Image from 'next/image';

import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center text-xl font-semibold">
    <Image
      src="/Favicons - Axie Studio/apple-icon-60x60.png"
      alt="Axie Studio Logo"
      width={40}
      height={40}
      className="mr-2"
    />
    {!props.isTextHidden && (
      <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
        Axie Studio
      </span>
    )}
  </div>
);
