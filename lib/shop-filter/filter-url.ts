export function updateFilterUrl(key: string, value: string, checked: boolean) {
  const params = new URLSearchParams(window.location.search);

  const currentValues = params.getAll(key);

  if (checked) {
    if (!currentValues.includes(value)) {
      params.append(key, value);
    }
  } else {
    params.delete(key);

    currentValues
      .filter((item) => item !== value)
      .forEach((item) => {
        params.append(key, item);
      });
  }

  return `${window.location.pathname}?${params.toString()}`;
}
