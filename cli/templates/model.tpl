export type {{ singular (pascalCase name) }} = {

}

/**
 * A factory function that creates {{ pascalCase name }}
 * @param params
 */
export function create{{ singular (pascalCase name) }}(params: Partial<{{ singular (pascalCase name) }}>) {
  return {

  } as {{ singular (pascalCase name) }};
}
