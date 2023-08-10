import type {Meta, StoryObj} from '@storybook/react';

import {SortableExample} from './SortableExample';
import docs from './docs/SortableDocs.mdx';

const meta: Meta<typeof SortableExample> = {
  component: SortableExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: docs,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortableExample>;

export const BasicSetup: Story = {
  name: 'Vertical',
};

export const VariableHeights: Story = {
  name: 'Variable heights',
  args: {
    heights: {1: 100, 3: 150, 5: 200, 8: 100, 12: 150},
  },
};

export const Horizontal: Story = {
  args: {
    widths: 180,
    horizontal: true,
  },
};

export const VariableWidths: Story = {
  name: 'Variable widths',
  args: {
    horizontal: true,
    widths: {0: 140, 2: 120, 4: 140, 5: 240, 8: 100, 12: 150, default: 180},
  },
};
