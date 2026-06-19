import qs from "query-string";

interface URLQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveURLQueryParams {
  params: string;
  keysToRemove: string[];
}

export function formUrlQuery({ params, key, value }: URLQueryParams) {
  const queryString = qs.parse(params);

  queryString[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveURLQueryParams) {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {
      skipNull: true,
    },
  );
}
