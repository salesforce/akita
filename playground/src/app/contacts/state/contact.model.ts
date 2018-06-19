export type Contact = {
  name: string;
  email: string;
  address: string;
};

/**
 * A factory function that creates Contacts
 * @param params
 */
export function createContact(params: Partial<Contact>) {
  return {} as Contact;
}
