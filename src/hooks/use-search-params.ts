import { useCallback, useEffect } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type UseSearchParamOptions = {
  exclusive?: boolean;
  preserve?: string[];
  shallow?: boolean;
};

export function useSearchParam<T extends string>(
  paramName: string,
  defaultValue: T | null,
  options: UseSearchParamOptions = {}
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useQueryState(paramName, parseAsString);

  // Set default value if not present
  useEffect(() => {
    if (!searchParams.get(paramName) && defaultValue !== null) {
      setValue(defaultValue, {
        history: 'replace',
        shallow: options.shallow ?? true,
      });
    }
  }, [paramName, defaultValue, searchParams, setValue, options.shallow]);

  const setValueWithOptions = useCallback(
    (newValue: T | null) => {
      if (options.exclusive) {
        // Create new URLSearchParams with only our param and preserved ones
        const params = new URLSearchParams();

        if (newValue !== null) {
          params.set(paramName, newValue);
        }

        // Add preserved params if any
        if (options.preserve?.length) {
          options.preserve.forEach((key) => {
            const preservedValue = searchParams.get(key);
            if (preservedValue) {
              params.set(key, preservedValue);
            }
          });
        }

        const search = params.toString();
        const query = search ? `?${search}` : '';
        router.replace(`${pathname}${query}`);
      } else {
        setValue(newValue, {
          history: 'replace',
          shallow: options.shallow ?? true,
        });
      }
    },
    [
      paramName,
      setValue,
      router,
      pathname,
      searchParams,
      options.exclusive,
      options.preserve,
      options.shallow,
    ]
  );

  return [value, setValueWithOptions] as const;
}
