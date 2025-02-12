import { stringify as yamlStringify } from 'https://deno.land/std@0.218.0/yaml/mod.ts';

export type OutputFormat = 'json' | 'yaml' | 'table' | 'text';

export interface OutputOptions {
  format?: OutputFormat;
}

export const outputBuilder = {
  format: {
    describe: 'Output format',
    type: 'string' as const,
    choices: ['json', 'yaml', 'table', 'text'] as const,
    default: 'text' as const,
  },
};

function padString(str: unknown, length: number): string {
  return String(str).padEnd(length);
}

function formatAsText(data: unknown): void {
  if (Array.isArray(data)) {
    if (data.length === 0) return;

    // Get headers and calculate maximum width for each column
    const headers = Object.keys(data[0] || {});
    if (headers.length === 0) return;

    const columnWidths = headers.reduce((acc, header) => {
      // Start with the header width
      acc[header] = header.length;

      // Check all values in this column to find the maximum width
      data.forEach((item) => {
        const value = (item as Record<string, unknown>)[header];
        const valueStr =
          typeof value === 'object' ? JSON.stringify(value) : String(value);
        acc[header] = Math.max(acc[header], valueStr.length);
      });

      // Add padding between columns
      acc[header] += 2;
      return acc;
    }, {} as Record<string, number>);

    // Print headers
    console.log(headers.map((h) => padString(h, columnWidths[h])).join(''));

    // Print separator line
    console.log(headers.map((h) => '-'.repeat(columnWidths[h])).join(''));

    // Print data rows
    data.forEach((item) => {
      console.log(
        headers
          .map((h) => {
            const value = (item as Record<string, unknown>)[h];
            return padString(
              typeof value === 'object' ? JSON.stringify(value) : value,
              columnWidths[h]
            );
          })
          .join('')
      );
    });
  } else if (typeof data === 'object' && data !== null) {
    // For single objects, find the longest key for alignment
    const entries = Object.entries(data as Record<string, unknown>);
    const maxKeyLength = Math.max(...entries.map(([key]) => key.length));

    // Output aligned key=value pairs
    entries.forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      if (typeof value === 'object') {
        console.log(`${paddedKey} = ${JSON.stringify(value)}`);
      } else {
        console.log(`${paddedKey} = ${value}`);
      }
    });
  } else {
    console.log(String(data));
  }
}

export function formatOutput(
  data: unknown,
  format: OutputFormat = 'table'
): void {
  switch (format) {
    case 'json':
      console.log(JSON.stringify(data, null, 2));
      break;
    case 'yaml':
      if (typeof data === 'object') {
        console.log(yamlStringify(data as Record<string, unknown>));
      } else {
        console.log(yamlStringify({ value: data }));
      }
      break;
    case 'text':
      formatAsText(data);
      break;
    case 'table':
      if (Array.isArray(data)) {
        console.table(data);
      } else if (typeof data === 'object' && data !== null) {
        console.table([data]);
      } else {
        console.log(data);
      }
      break;
    default:
      console.log(data);
  }
}
