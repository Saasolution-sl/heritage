'use client';

import { useSyncExternalStore } from 'react';
import { ruleFor } from '@/config/compliance';
import { subscribeNoop, getCountryCookie, getServerCountry } from '@/lib/ageStore';

/** A country-specific notice, when one is configured for the visitor's country. */
export function CountryNotice() {
  const country = useSyncExternalStore(subscribeNoop, getCountryCookie, getServerCountry);
  const notice = country ? ruleFor(country).notice : undefined;
  if (!notice) return null;
  return (
    <p className="warning" role="note">
      {notice}
    </p>
  );
}
