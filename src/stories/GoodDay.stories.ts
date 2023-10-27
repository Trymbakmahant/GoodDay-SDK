import type { Meta, StoryObj } from '@storybook/react';

import { GooDay } from './../GooDay';

const meta = {
  title: 'Example/GoodDay',
  component: GooDay
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
} satisfies Meta<typeof GooDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {};
