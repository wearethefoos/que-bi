export const VARIABLES_PATTERN = /(\[(DATE|INT|FLOAT|STRING):(.+?)(;(.+)?)?\])/;
export const VARIABLES_PATTERN_G = new RegExp(VARIABLES_PATTERN, "g");

export type QueryParams = {
  query: string;
  params?: URLSearchParams;
};

export type QueryArg = {
  name: string;
  value?: any;
  defaultValue?: any;
  options?: string[];
};

export const queryArgumentsAndValues = ({
  query,
  params,
}: QueryParams): QueryArg[] => {
  const queryArguments = query.match(VARIABLES_PATTERN_G);
  if (!queryArguments) return [];

  return queryArguments
    .map((p) => {
      const ms = p.match(VARIABLES_PATTERN);
      if (ms) {
        const [, , type, name, , opts] = ms;
        return {
          name,
          value: argumentValue(name, type, opts, params),
          defaultValue: defaultArgumentValue(type, opts),
          options: argumentValueOptions(type, opts),
        };
      }
    })
    .filter(Boolean) as QueryArg[];
};

export const argumentValue = (
  name: string,
  type: string,
  opts: string,
  params: any,
): string => {
  if (!name) return "";
  return escape(params[name], type, opts) || defaultArgumentValue(type, opts);
};

const defaultArgumentValue = (type: string, opts: string): string => {
  if (!opts) return "";
  const defaults = opts.match(/default=([A-Za-z0-9-_]+)/);
  if (!defaults) return "NULL";
  return escape(defaults[1], type, opts);
};

export const argumentValueOptions = (
  type: string,
  opts: string,
): string[] | undefined => {
  if (!opts) return;
  const options = opts.match(/options=([A-Za-z0-9-_,]+)/);
  if (!options) return;
  return options[1].split(",");
};

const escape = (value: string, type: string, opts: string): string => {
  if (!value || value === "undefined") return defaultArgumentValue(type, opts);
  switch (type) {
    case "INT":
    case "FLOAT":
      return `${Number(value)}::${type}`;

    case "DATE":
      return `'${value}'::${type}`;

    default:
      return `'${value
        .replace(/\\/g, "\\")
        .replace(/'/g, "'")
        .replace(/;/g, "")
        .replace("NULL", "")}'::TEXT`;
  }
};
