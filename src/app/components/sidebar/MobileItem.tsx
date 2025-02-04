'use client'

import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react'

interface MobileItemProp {
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const MobileItem: FC<MobileItemProp>= ({href, icon: Icon, active, onClick}) => {
  const handleClick = () => {
    if (onClick) return onClick();
  }

  return (
    <Link
      onClick={onClick}
      href={href}
      className={clsx(`group flex gap-z-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
      active && "bg-gray-100 text-black"
      )}
    >
      <Icon className = "h-6 w-6" />
    </Link>
  )
}

export default MobileItem