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
export function createStory(params: Partial<Story> = {}) {
  return {
    title: params.title || '',
    story: params.story || '',
    draft: params.draft || false,
    category: 'js'
  } as Story;
}
