import { lexicalHTMLField } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'ctaLabel', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: 'Tool tiles on the toolbox hero, checkmarks on the other hero styles.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}

const RichText: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'content', type: 'richText', required: true },
    lexicalHTMLField({ htmlFieldName: 'html', lexicalFieldName: 'content' }),
  ],
}

const featureIcons = ['template', 'ai', 'download', 'check', 'globe', 'star'] as const

const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'select', options: [...featureIcons], defaultValue: 'check', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

const Cta: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
  ],
}

const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Plans, prices and the country selector come live from the application API.',
      },
    },
    { name: 'intro', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
  ],
}

const TemplateGallery: Block = {
  slug: 'templateGallery',
  interfaceName: 'TemplateGalleryBlock',
  admin: {
    disableBlockName: true,
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    {
      name: 'templates',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

export const pageBlocks: Block[] = [Hero, RichText, FeatureGrid, TemplateGallery, Pricing, Faq, Cta]
