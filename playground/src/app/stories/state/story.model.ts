export type Story = {
  title: string;
  story: string;
  draft: boolean;
  category: string;
};

/**
 * A factory function that creates Stories
 * @param params
 */
export function createStory() {
  return {
    title: '',
    story: '',
    draft: false,
    category: 'js'
  } as Story;
}
