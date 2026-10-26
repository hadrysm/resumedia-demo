import Cta from './Cta.astro'
import Faq from './Faq.astro'
import FeatureGrid from './FeatureGrid.astro'
import Hero from './Hero.astro'
import Pricing from './Pricing.astro'
import RichText from './RichText.astro'
import TemplateGallery from './TemplateGallery.astro'
import type { Block, BlockContext, BlockProps, BlockType } from './types'

/** One Astro component per Payload block. Adding a block to the CMS without one here fails the type check. */
export const blockRegistry = {
  hero: Hero,
  richText: RichText,
  featureGrid: FeatureGrid,
  templateGallery: TemplateGallery,
  pricing: Pricing,
  faq: Faq,
  cta: Cta,
} satisfies { [K in BlockType]: (props: BlockProps<K>) => unknown }

type AnyBlockComponent = (props: { block: Block; ctx: BlockContext }) => unknown

/** The component for a block, or undefined for a block type this deploy does not know yet. */
export function componentFor(block: { blockType: string }): AnyBlockComponent | undefined {
  return Object.hasOwn(blockRegistry, block.blockType)
    ? (blockRegistry[block.blockType as BlockType] as AnyBlockComponent)
    : undefined
}
