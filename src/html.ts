/**
 * String template utility that adds syntax highlighting and formatting in text editors.
 *
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 */
export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  const processedValues = values.map(value =>
    Array.isArray(value) ? value.join('') : value
  );

  return strings.reduce(
    (prev, curr, i) => `${prev}${curr}${processedValues[i] || ''}`,
    ''
  );
};
