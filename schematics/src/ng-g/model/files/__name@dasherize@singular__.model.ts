export interface <%= singular(classify(name)) %> {
  id: number | string;
}

export function create<%= singular(classify(name)) %>(params: Partial<<%= singular(classify(name)) %>>) {
  return {

  } as <%= singular(classify(name)) %>;
}
