import SurfaceContainer from '../Surface'
import Button from './Button'
import { type Meta, type StoryObj } from '@storybook/react'
import { TalismanHand } from '@talismn/web-icons'

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => (
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div css={{ width: 300, marginBottom: '1.6rem' }}>
          <Story />
        </div>
        <div css={{ width: 'fit-content' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    style: { width: '100%' },
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Click me', leadingIcon: <TalismanHand />, trailingIcon: <TalismanHand /> },
}

export const Outlined: Story = {
  args: { variant: 'outlined', children: 'Click me', leadingIcon: <TalismanHand />, trailingIcon: <TalismanHand /> },
}

export const Text: Story = {
  args: { variant: 'text', children: 'Click me', leadingIcon: <TalismanHand />, trailingIcon: <TalismanHand /> },
}

export const Surface: Story = {
  render: args => (
    <SurfaceContainer css={{ padding: '1.6rem' }}>
      <Button {...args} css={{ marginBottom: '1.6rem' }} />
      <SurfaceContainer css={{ padding: '1.6rem' }}>
        <Button {...args} />
      </SurfaceContainer>
    </SurfaceContainer>
  ),
  args: { variant: 'surface', children: 'Click me', leadingIcon: <TalismanHand />, trailingIcon: <TalismanHand /> },
}
